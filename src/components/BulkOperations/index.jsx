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

import TableContainer from '../../containers/TableContainer';
import ButtonToolbar from '../ButtonToolbar';
import PageContainer from '../PageContainer';
import { formatDate, getPageOptionsFromUrl, updateUrl } from '../../utils';
import Pill from '../Pill';
import { PUBLISHED, REVIEWED, ARCHIVED } from '../../data/constants';

import { SelectMenu, MenuItem, Dropzone, DataTable} from '@openedx/paragon';

import classNames from 'classnames';
import Collapsible from '../Collapsible'
import RenderSelectField from '../RenderSelectField';
import './BulkOperations.scss';


function BulkOperations(){

    const availableOperations = ["Bulk Create", "Bulk Update", "Bulk Rerun"]
    const [bulkOperationId, setBulkOperationId] = React.useState(null);

    const [fileContent, setFileContent] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [fileSize, setFileSize] = useState(null);
    const [file, setFile] = useState(null);

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
        const res = await DiscoveryDataApiService.createBulkOperation(file, bulkOperationId);
        // debugger;
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
        
        <div className='data-container-excel'>
            <div class="row justify-content-between">
                <div class="col-auto">
                    {fileName}<br/>
                    {parsed.data.length} rows - {fileSize} Bytes
                </div>
                <div class="col-auto">
                <button className="btn btn-outline-primary" onClick={handleSubmit}>
                    Process File
                </button>
                <button className="btn btn-outline-primary" onClick={handleUploadNew}>
                    Upload New File
                </button>

                </div>
            </div>

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
        )
    }

    async function fetchBulkOpTasks(){
        const response = await DiscoveryDataApiService.fetchBulkOperations();
        setHistoricalRecords(response.data.results);
    }

    useEffect(() => {
        fetchBulkOpTasks();
    }, [])

    return <>
            <SelectMenu defaultMessage="Choose a Bulk Operation">
                {
                    availableOperations.map((op, idx) => (
                        <MenuItem actionid={idx} onClick={e => setBulkOperationId(Number(e.target.getAttribute("actionid")))}>
                            {op}
                        </MenuItem>
                    ))
                }
            </SelectMenu>

            <h3>
                {bulkOperationId == null ? '' : availableOperations[bulkOperationId]}
            </h3>

            <Collapsible title="Show historical records">
                {historicalRecords && historicalRecords.map(rec => {
                    return (
                    <>
                    <div class="row justify-content-between">
                        <div class="col-auto">
                            {rec.csv_file} (details)<br/>
                            {rec.created}
                        </div>
                        <div class="col-auto">
                            <span className={classNames(
                                {'badge': true, 'badge-danger': rec.status=='Failure', 'badge-success': rec.status == 'Success'})}>
                                    {rec.status}
                            </span><br/>
                            {45} / {134} records
                        </div>
                    </div>
                    <hr/>
                    </>
                    )
                })}
            </Collapsible>
            

            {
                fileContent ? getTable() : getDropZone()
            }

        </>

}

export default BulkOperations;
