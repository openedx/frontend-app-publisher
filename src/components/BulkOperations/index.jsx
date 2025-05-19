import { useEffect, useState } from 'react';
import classNames from 'classnames';
import Papa from 'papaparse';
import {
  SelectMenu, MenuItem, Dropzone, DataTable, Alert,
} from '@openedx/paragon';

import Collapsible from '../Collapsible';
import LoadingSpinner from '../LoadingSpinner';
import { formatDate } from '../../utils';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import './BulkOperations.scss';

const availableOperations = {
  course_create: 'Bulk Create',
  course_partial_update: 'Bulk Course Update',
  course_run_partial_update: 'Bulk CourseRun Update',
  course_rerun: 'Bulk Rerun',
};

const BulkOperations = () => {
  const [bulkOperationId, setBulkOperationId] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [historicalRecords, setHistoricalRecords] = useState(null);

  function filteredHistoricalRecords() {
    if (historicalRecords == null) {
      return [];
    }
    return historicalRecords.filter(rec => !bulkOperationId || rec.task_type === bulkOperationId);
  }

  function handleUploadNew() {
    setFileContent(null);
    setFile(null);
  }

  function handleFileUpload({ fileData }) {
    const file = fileData.get('file');
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setFile(file);
      setFileContent(text);
    };
    reader.readAsText(file);
  }

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const res = await DiscoveryDataApiService.createBulkOperation(file, bulkOperationId);
      setSubmitSuccess(true);
      setHistoricalRecords([res.data, ...historicalRecords]);
    } catch (e) {
      setSubmitSuccess(false);
    }
    setIsLoading(false);
  }

  async function fetchBulkOpTasks() {
    const response = await DiscoveryDataApiService.fetchBulkOperations();
    setHistoricalRecords(response.data.results);
  }

  function getDropZone() {
    return (
      <Dropzone
        onProcessUpload={handleFileUpload}
      />
    );
  }

  function getCollapsibleTitle() {
    return <span className="font-weight-bold">Processing History</span>;
  }

  function getAlert() {
    let variant; let
      message;
    if (submitSuccess == null) {
      return null;
    }

    if (submitSuccess == true) {
      variant = 'success';
      message = 'Successfully submitted task for bulk operation';
    } else if (submitSuccess == false) {
      variant = 'danger';
      message = 'Failed to submit task for processing';
    }

    return <Alert variant={variant} dismissible onClick={() => { setSubmitSuccess(null); }}>{message}</Alert>;
  }

  function getTable() {
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    const columns = parsed.meta.fields.map(fieldName => ({
      Header: fieldName, accessor: fieldName, width: 400, size: 400,
    }));

    return (
      <div data-testid="file-preview" className="data-container-excel">
        <div className="row justify-content-between border-bottom">
          <div className="col-auto">
            <span className="font-weight-bold">{file.name}</span><br />
            {parsed.data.length} rows - {file.size} B
          </div>
          <div className="col-auto">
            <button data-testid="process-file" className="btn btn-outline-primary mr-2" onClick={handleSubmit}>
              Process File
            </button>
            <button data-testid="upload-new" className="btn btn-outline-primary" onClick={handleUploadNew}>
              Upload New File
            </button>
          </div>
        </div>

        <div className="mt-3">
          <DataTable
            isPaginated
            initialState={{
              pageSize: 2,
            }}
            itemCount={parsed.data.length}
            data={parsed.data}
            columns={columns}
          >
            <DataTable.Table />
            <DataTable.EmptyTable content="No results found" />
            <DataTable.TableFooter />
          </DataTable>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchBulkOpTasks().then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="bulk-operations-spinner">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-5 my-5">
      {getAlert()}
      <SelectMenu className="mb-3" defaultMessage="Choose a Bulk Operation">
        {
                    Object.entries(availableOperations).map(([slug, title]) => (
                      <MenuItem actionid={slug} defaultSelected={slug === bulkOperationId} onClick={e => setBulkOperationId(e.currentTarget.getAttribute('actionid'))}>
                        {title}
                      </MenuItem>
                    ))
                }
      </SelectMenu>

      <Collapsible title={getCollapsibleTitle()}>
        {filteredHistoricalRecords().map(rec => (
          <>
            <div className="row justify-content-between">
              <div className="col-auto">
                <a href={rec.csv_file}>{rec.csv_file.split('/').pop()}</a><br />
                <span className="small">{formatDate(rec.created)}</span>
              </div>
              <div className="col-auto d-flex flex-column align-items-end">
                <span className={classNames(
                  {
                    badge: true,
                    'badge-danger': rec.status == 'failed',
                    'badge-success': rec.status == 'completed',
                    'badge-warning': rec.status == 'processing',
                    'badge-info': rec.status == 'pending',
                  },
                )}
                >
                  {rec.status}
                </span>
                <a href={`/bulk-operation-tasks/${rec.id}`}>details</a>
              </div>
            </div>
            <hr />
          </>
        ))}
      </Collapsible>

      <div className="my-3 py-3 px-3 border">
        {
                    fileContent ? getTable() : getDropZone()
                }
      </div>
    </div>
  );
};

export default BulkOperations;
