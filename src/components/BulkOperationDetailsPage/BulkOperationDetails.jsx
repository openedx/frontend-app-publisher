import React, { useState, useMemo } from 'react';
import 'moment-timezone';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import {
  Button, DataTable, useToggle, FullscreenModal, Stack,
} from '@openedx/paragon';

import { formatDateTime } from '../../utils';
import './styles.scss';

const ImageCell = ({ value }) => (
  value ? (
    <a href={value} target="_blank" rel="noopener noreferrer">
      View Image
    </a>
  ) : null
);

const parseCSV = async (url) => {
  const response = await fetch(url);
  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, meta } = results;
        const headers = meta.fields;
        resolve({ headers, rows: data });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

const BulkOperationDetails = ({ task }) => {
  const [csvRows, setCsvRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [isOpen, open, close] = useToggle(false);
  const [csvPreviewError, setCsvPreviewError] = useState(null);
  const DEFAULT_CSV_PREVIEW_PAGE_SIZE = 10;

  const taskInfoRows = [
    { key: 'Task ID', value: task.task_id },
    { key: 'Task type', value: task.task_type },
    { key: 'Uploaded by', value: task.uploaded_by },
    { key: 'Status', value: task.status },
    { key: 'Created', value: formatDateTime(task.created) },
    { key: 'Modified', value: formatDateTime(task.modified) },
  ];

  const taskInfoColumns = [
    { Header: 'Field', accessor: 'key' },
    { Header: 'Value', accessor: 'value' },
  ];

  const handlePreviewCSV = async () => {
    try {
      const { headers, rows } = await parseCSV(task.csv_file);
      setCsvHeaders(headers);
      setCsvRows(rows);
    } catch (error) {
      setCsvPreviewError(`Failed to preview CSV: ${error.message}`);
    }
  };

  const getDataTableColumns = (headers) => headers.map((header) => {
    const isImageColumn = header.toLowerCase() === 'image';

    const column = {
      Header: header,
      accessor: header,
    };

    if (isImageColumn) {
      column.Cell = ImageCell;
    }

    return column;
  });

  const columns = useMemo(() => { // eslint-disable-line react-hooks/rules-of-hooks
    if (!csvHeaders || csvHeaders.length === 0) {
      return [];
    }
    return getDataTableColumns(csvHeaders);
  }, [csvHeaders]);

  const data = useMemo(() => { // eslint-disable-line react-hooks/rules-of-hooks
    if (!csvHeaders || csvHeaders.length === 0 || !csvRows || csvRows.length === 0) {
      return [];
    }
    return csvRows;
  }, [csvRows, csvHeaders]);

  return (
    <div className="container mt-2">
      <h2 className="mb-2">Task Details</h2>
      <div className="bulk-op-details-table-container">
        <DataTable
          columns={taskInfoColumns}
          data={taskInfoRows}
          showPagination={false}
        />
      </div>

      <Stack direction="horizontal" gap={3} className="mb-4 mt-4">
        <a
          href={task.csv_file}
          className="btn btn-outline-primary download"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download CSV
        </a>
        <Button
          variant="primary"
          className="PreviewCSV"
          onClick={() => {
            handlePreviewCSV();
            open();
          }}
        >
          Preview CSV
        </Button>
        <FullscreenModal
          className="csv-preview-fs-modal"
          title="CSV Preview"
          isOpen={isOpen}
          onClose={close}
          isOverflowVisible={false}
        >
          <div className="csv-preview-modal">
            {csvPreviewError && (
              <div className="alert alert-danger" role="alert">
                {csvPreviewError}
              </div>
            )}
            <DataTable
              className="bulk-op-table"
              columns={columns}
              data={data}
              isPaginated
              initialState={{
                pageSize: DEFAULT_CSV_PREVIEW_PAGE_SIZE,
              }}
              itemCount={csvRows.length}
              data-testid="csv-table"
            />
            <DataTable.EmptyTable content="No results found" />
            <DataTable.TableFooter />
          </div>
        </FullscreenModal>
      </Stack>

      {task.task_summary && (
        <div className="bg-light p-3 rounded">
          <h4>Task Summary</h4>
          <pre className="bg-white p-2 rounded border">
            {JSON.stringify(task.task_summary, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

ImageCell.propTypes = {
  value: PropTypes.string,
};

ImageCell.defaultProps = {
  value: null,
};

BulkOperationDetails.propTypes = {
  task: PropTypes.shape({
    task_id: PropTypes.string.isRequired,
    task_type: PropTypes.string.isRequired,
    uploaded_by: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    modified: PropTypes.string.isRequired,
    csv_file: PropTypes.string.isRequired,
    task_summary: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  }),
};

BulkOperationDetails.defaultProps = {
  task: null,
};

export default BulkOperationDetails;
