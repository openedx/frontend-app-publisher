import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import qs from 'query-string';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { SearchField } from '@openedx/paragon';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import Papa from 'papaparse';

import LoadingSpinner from '../LoadingSpinner';
import TableContainer from '../../containers/TableContainer';
import ButtonToolbar from '../ButtonToolbar';
import PageContainer from '../PageContainer';
import { formatDate, getPageOptionsFromUrl, updateUrl } from '../../utils';
import Pill from '../Pill';
import { PUBLISHED, REVIEWED, ARCHIVED } from '../../data/constants';

import { SelectMenu, MenuItem, Dropzone, DataTable, Alert} from '@openedx/paragon';

import classNames from 'classnames';
import Collapsible from '../Collapsible'
import RenderSelectField from '../RenderSelectField';
import './BulkOperations.scss';


function BulkOperations(){

    const availableOperations = {
        "course_create": "Bulk Create",
        "course_partial_update": "Bulk Course Update",
        "course_run_partial_update": "Bulk CourseRun Update",
        "course_rerun": "Bulk Rerun"
    }

    const [bulkOperationId, setBulkOperationId] = React.useState(null);

    const [fileContent, setFileContent] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [fileSize, setFileSize] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [historicalRecords, setHistoricalRecords] = useState(null);

    function handleUploadNew(){
        setFileContent(null);
        setFileName(null);
        setFileSize(null);
        setFile(null);
    }

    function handleFileUpload({fileData}){
        let file = fileData.get('file');
        file.text().then(content => {setFile(file); setFileContent(content); setFileName(file.name); setFileSize(file.size)});
    }

    async function handleSubmit(){
        setIsLoading(true);
        try {
            const res = await DiscoveryDataApiService.createBulkOperation(file, bulkOperationId);
            setSubmitSuccess(true);
            setHistoricalRecords([res.data,...historicalRecords])
        }
        catch (e) {
            setSubmitSuccess(false);
        }
        setIsLoading(false);
    }

    function getDropZone(){
        return <Dropzone
            onProcessUpload={handleFileUpload}
            onUploadProgress={(percent) => console.log(percent)}
        />

    }

    function getTable(){        
        let parsed = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
        });

        console.log(parsed, 'WOOHOO')
        let columns= parsed.meta.fields.map(fieldName => ({Header: fieldName, accessor: fieldName, width: 400, size:400}))
        
        
        return ( 
        <>
        <div data-testid="file-preview" className='data-container-excel'>
            <div class="row justify-content-between border-bottom">
                <div class="col-auto">
                    <span className='font-weight-bold'>{fileName}</span><br/>
                    {parsed.data.length} rows - {fileSize} B
                </div>
                <div class="col-auto">
                <button data-testid="process-file" className="btn btn-outline-primary mr-2" onClick={handleSubmit}>
                    Process File
                </button>
                <button data-testid="upload-new" className="btn btn-outline-primary" onClick={handleUploadNew}>
                    Upload New File
                </button>

                </div>
            </div>
            
            <div className='mt-3'>
            <DataTable
                isPaginated
                initialState={{
                pageSize: 2,
                }}
                // defaultColumnValues={{ Filter: TextFilter }}
                itemCount={parsed.data.length}
                data={parsed.data}
                columns={columns}
            >
                {/* <DataTable.TableControlBar /> */}
                <DataTable.Table />
                <DataTable.EmptyTable content="No results found" />
                <DataTable.TableFooter />
            </DataTable>
            </div>
        </div>
        </>
        )
    }

    async function fetchBulkOpTasks(){
        const response = await DiscoveryDataApiService.fetchBulkOperations();
        setHistoricalRecords(response.data.results);
    }

    function getCollapsibleTitle() {
        return <span className='font-weight-bold'>Processing History</span>
    }

    function filteredHistoricalRecords() {
        if (historicalRecords == null){
            return []
        }
        return historicalRecords.filter(rec => !bulkOperationId || rec.task_type == bulkOperationId)
    }

    useEffect(() => {
        fetchBulkOpTasks().then(() => setIsLoading(false));
    }, [])

    function getAlert() {
        let variant, message;
        if (submitSuccess == null) {
            return null;
        }

        if (submitSuccess == true) {
            variant = "success"
            message = "Successfully submitted task for bulk operation"
        }
        else if (submitSuccess == false) {
            variant = "danger"
            message = "Failed to submit task for processing"
        }

        return <Alert variant={variant} dismissible onClick={() => {setSubmitSuccess(null)}}>{message}</Alert>
    }

    if (isLoading){
        return <div className='spinner'>
            <LoadingSpinner/>
        </div> 
    }

    return <div className='mx-5 my-5'>
            {getAlert()}
            <SelectMenu className="mb-3" defaultMessage="Choose a Bulk Operation">
                {
                    Object.entries(availableOperations).map(([slug, title]) => (
                        <MenuItem actionid={slug} defaultSelected={slug === bulkOperationId} onClick={e => setBulkOperationId(e.currentTarget.getAttribute("actionid"))}>
                            {title}
                        </MenuItem>
                    ))
                }
            </SelectMenu>

            <Collapsible title={getCollapsibleTitle()}>
                {filteredHistoricalRecords().map(rec => {
                    return (
                    <>
                    <div class="row justify-content-between">
                        <div class="col-auto">
                            <a href={rec.csv_file}>{rec.csv_file.split('/').pop()}</a><br/>
                            <span className='small'>{formatDate(rec.created)}</span>
                        </div>
                        <div class="col-auto d-flex flex-column align-items-end">
                            <span className={classNames(
                                {
                                    'badge': true, 'badge-danger': rec.status=='failed', 'badge-success': rec.status == 'completed',
                                    'badge-warning': rec.status == 'processing', 'badge-info': rec.status == 'pending'
                                })}>
                                    {rec.status}
                            </span>
                            <a href={`/bulk-ops/${rec.id}`}>details</a>
                        </div>
                    </div>
                    <hr/>
                    </>
                    )
                })}
            </Collapsible>
            
            
            <div className='my-3 py-3 px-3 border'> 
                {
                    fileContent ? getTable() : getDropZone()
                }
            </div>
            

        </div>
}

export default BulkOperations;
