import { useState } from 'react';
import Papa from 'papaparse';
import {
  SelectMenu, MenuItem, Dropzone, DataTable, Alert, Container, DropdownFilter
} from '@openedx/paragon';

import LoadingSpinner from '../LoadingSpinner';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import './BulkOperations.scss';
import { AVAILABLE_BULK_OPERATIONS as availableOperations } from '../../data/constants';
import HistoricalRecords from './HistoricalRecords';

const BulkOperations = () => {
  const [bulkOperationId, setBulkOperationId] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const CSV_ROWS_PER_PAGE = 10;

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
      clearDropzone();
    } catch (error) {
      setSubmitSuccess(false);
    }
    setIsLoading(false);
  }

  function getDropZone() {
    return (
      <Dropzone
        // eslint-disable-next-line react/jsx-no-bind
        onProcessUpload={handleFileUpload}
      />
    );
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

  return (
    <>
    {isLoading && (
      <div className="min-vh-65">
        <LoadingSpinner />
      </div>
    )}
    {!isLoading && (
      <div className="mx-5 my-5">
        {getAlert()}
        <SelectMenu className="mb-3" defaultMessage="Choose a Bulk Operation">
          {
            Object.entries(availableOperations).map(([id, title]) => (
              <MenuItem actionid={id} key={id} defaultSelected={id === bulkOperationId} onClick={e => setBulkOperationId(e.currentTarget.getAttribute('actionid'))}>
                {title}
              </MenuItem>
            ))
          }
        </SelectMenu>
        <div className="my-3 py-3 px-3 border">
          {
            fileContent ? getTable() : getDropZone()
          }
        </div>
        <HistoricalRecords />
      </div>
    )}

    </>
  );
};

const ContainerizedBulkOperations = () => (
  <Container size="lg">
    <BulkOperations />
  </Container>
);

export default ContainerizedBulkOperations;
