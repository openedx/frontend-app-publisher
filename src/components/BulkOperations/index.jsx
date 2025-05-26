import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Papa from 'papaparse';
import {
  SelectMenu, MenuItem, Dropzone, DataTable, Alert, Container,
} from '@openedx/paragon';

import Collapsible from '../Collapsible';
import LoadingSpinner from '../LoadingSpinner';
import { formatDate } from '../../utils';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import './BulkOperations.scss';
import { AVAILABLE_BULK_OPERATIONS as availableOperations } from '../../data/constants';

const BulkOperations = () => {
  const [bulkOperationId, setBulkOperationId] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [historicalRecords, setHistoricalRecords] = useState(null);
  const [isError, setIsError] = useState(false);
  const CSV_ROWS_PER_PAGE = 10;

  function filteredHistoricalRecords() {
    if (historicalRecords == null) {
      return [];
    }
    return historicalRecords.filter(record => !bulkOperationId || record.task_type === bulkOperationId);
  }

  function clearDropzone() {
    setFileContent(null);
    setFile(null);
  }

  function handleFileUpload({ fileData }) {
    const csvFile = fileData.get('file');
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      setFile(csvFile);
      setFileContent(text);
    };
    reader.readAsText(csvFile);
  }

  async function handleSubmit() {
    setIsLoading(true);
    try {
      const response = await DiscoveryDataApiService.createBulkOperation(file, bulkOperationId);
      setSubmitSuccess(true);
      setHistoricalRecords([response.data, ...historicalRecords]);
      clearDropzone();
    } catch (error) {
      setSubmitSuccess(false);
    }
    setIsLoading(false);
  }

  async function fetchBulkOpTasks() {
    try {
      const response = await DiscoveryDataApiService.fetchBulkOperations();
      setHistoricalRecords(response.data.results);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function getDropZone() {
    return (
      <Dropzone
        // eslint-disable-next-line react/jsx-no-bind
        onProcessUpload={handleFileUpload}
      />
    );
  }

  function getCollapsibleTitle() {
    return <span className="font-weight-bold">Processing History</span>;
  }

  function getAlert() {
    let variant;
    let message;
    if (submitSuccess == null) {
      return null;
    }

    if (submitSuccess === true) {
      variant = 'success';
      message = 'Successfully submitted task for bulk operation';
    } else if (submitSuccess === false) {
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
      Header: fieldName, accessor: fieldName,
    }));

    return (
      <div data-testid="file-preview" className="data-container-excel">
        <div className="row justify-content-between border-bottom">
          <div className="col-auto">
            <span className="font-weight-bold">{file.name}</span><br />
            {parsed.data.length} rows
          </div>
          <div className="col-auto">
            <button type="button" data-testid="process-file" className="btn btn-outline-primary mr-2" onClick={handleSubmit}>
              Process File
            </button>
            <button type="button" data-testid="upload-new" className="btn btn-outline-primary" onClick={clearDropzone}>
              Upload New File
            </button>
          </div>
        </div>

        <div className="mt-3">
          <DataTable
            isPaginated
            initialState={{
              pageSize: CSV_ROWS_PER_PAGE,
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
    fetchBulkOpTasks();
  }, []);

  if (isError) {
    return (
      <div className="min-vh-65">
        <Alert variant="danger">Failed to fetch historical tasks. Please try reloading the page</Alert>;
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-vh-65">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-5 my-5">
      {getAlert()}
      <SelectMenu className="mb-3" defaultMessage="Choose a Bulk Operation">
        {
          Object.entries(availableOperations).map(([id, title]) => (
            <MenuItem actionid={id} defaultSelected={id === bulkOperationId} onClick={e => setBulkOperationId(e.currentTarget.getAttribute('actionid'))}>
              {title}
            </MenuItem>
          ))
        }
      </SelectMenu>

      <Collapsible title={getCollapsibleTitle()}>
        {filteredHistoricalRecords().map(record => (
          <>
            <div className="row justify-content-between">
              <div className="col-auto">
                <Link to={`/bulk-operation-tasks/${record.id}`}>{record.csv_file.split('/').pop()}</Link><br />
                <span className="small">{formatDate(record.created)}</span>
              </div>
              <div className="col-auto d-flex flex-column align-items-end">
                <span className={classNames(
                  {
                    badge: true,
                    'text-capitalize': true,
                    'badge-danger': record.status === 'failed',
                    'badge-success': record.status === 'completed',
                    'badge-warning': record.status === 'processing',
                    'badge-info': record.status === 'pending',
                  },
                )}
                >
                  {record.status}
                </span>
                <Link to={`/bulk-operation-tasks/${record.id}`}>details</Link>
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

const ContainerizedBulkOperations = () => (
  <Container size="lg">
    <BulkOperations />
  </Container>
);

export default ContainerizedBulkOperations;
