import React, { useState, useEffect } from 'react';
import 'moment-timezone';
import PropTypes from 'prop-types';
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

ImageCell.propTypes = {
  value: PropTypes.string,
};

ImageCell.defaultProps = {
  value: null,
};

const parseCSV = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const lines = text.trim().split('\n');

  const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  const cleanedHeaders = headers.map((h) => h.replace(/(^"|"$)/g, ''));

  const rows = lines.slice(1).map((line) => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((cell) => cell.replace(/(^"|"$)/g, '')));

  return { headers: cleanedHeaders, rows };
};

const BulkOperationDetails = ({ task }) => {
  const [csvRows, setCsvRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [isOpen, open, close] = useToggle(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [csvPreviewError, setCsvPreviewError] = useState(null);
  const DEFAULT_CSV_PREVIEW_PAGE_SIZE = 5;

  useEffect(() => {
    const debounceDelay = 500;

    const timeout = setTimeout(() => {
      if (!task || Object.keys(task).length === 0) {
        setShowNotFound(true);
      } else {
        setShowNotFound(false);
      }
    }, debounceDelay);

    return () => clearTimeout(timeout);
  }, [task]);

  if (showNotFound) {
    return (
      <p className="text-info">
        No BulkOperationTask found against the given ID. Please check the ID and try again.
      </p>
    );
  }

  const handlePreviewCSV = async () => {
    try {
      const { headers, rows } = await parseCSV(task.csv_file);
      setCsvHeaders(headers);
      setCsvRows(rows);
    } catch (error) {
      console.error('Failed to preview CSV:', error);
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

  return (
    <div className="container mt-2">
      <h2 className="mb-4">Task Details</h2>
      <p><strong>Task ID:</strong> {task.task_id}</p>
      <p><strong>Task type:</strong> {task.task_type}</p>
      <p><strong>Uploaded by:</strong> {task.uploaded_by}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Created:</strong> {task && formatDateTime(task.created)}</p>
      <p><strong>Modified:</strong> {task && formatDateTime(task.modified)}</p>

      <Stack direction="horizontal" gap={3} className="mb-4 mt-4">
        <a
          href={task.csv_file}
          className="btn btn-outline-primary me-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download CSV
        </a>
        <Button
          className="ms-2"
          variant="primary"
          onClick={() => {
            handlePreviewCSV();
            open();
          }}
        >
          Preview CSV
        </Button>
        <FullscreenModal
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
              columns={getDataTableColumns(csvHeaders)}
              data={csvRows.map((row) => row.reduce((accumulator, value, index) => {
                accumulator[csvHeaders[index]] = value;
                return accumulator;
              }, {}))}
              defaultPageSize={DEFAULT_CSV_PREVIEW_PAGE_SIZE}
              itemCount={csvRows.length}
              showPagination={false}
              data-testid="csv-table"
            />
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
