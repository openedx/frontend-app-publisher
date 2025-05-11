import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import qs from 'query-string';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { SearchField } from '@openedx/paragon';

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

    const dummyRecords = [
        {success: 123, total: 500, status: 'Success', fileName: 'foo.csv', date: '2022/04/03'},
        {success: 123, total: 500, status: 'Failure', fileName: 'bar.csv', date: '2022/04/03'}
    ]

    function handleUploadNew(){
        setFileContent(null);
        setFileName(null);
        setFileSize(null);
    }

    function handleFileUpload({fileData}){
        let file = fileData.get('file');
        file.text().then(content => {setFileContent(content); setFileName(file.name); setFileSize(file.size)});
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
                <button className="btn btn-outline-primary">
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
                {dummyRecords.map(rec => {
                    return (
                    <>
                    <div class="row justify-content-between">
                        <div class="col-auto">
                            {rec.fileName} (details)<br/>
                            {rec.date}
                        </div>
                        <div class="col-auto">
                            <span className={classNames(
                                {'badge': true, 'badge-danger': rec.status=='Failure', 'badge-success': rec.status == 'Success'})}>
                                    {rec.status}
                            </span><br/>
                            {rec.total} / {rec.success} records
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
