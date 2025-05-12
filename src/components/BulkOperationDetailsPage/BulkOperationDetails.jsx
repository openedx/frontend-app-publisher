import React, { useState } from "react";
import moment from "moment";
import './styles.scss';
import "moment-timezone";
import {
  Button,
  DataTable,
  useToggle,
  StandardModal,
  Stack,
} from "@openedx/paragon";

export default function BulkOperationDetails({ task }) {
  const [csvRows, setCsvRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [isOpen, open, close] = useToggle(false);

  const handlePreviewCSV = async () => {
    try {
      const response = await fetch(task.csv_file);
      const text = await response.text();
      const lines = text.trim().split("\n");

      const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const cleanedHeaders = headers.map((header) =>
            header.replace(/(^"|"$)/g, "")
        );
      const rows = lines
        .slice(1)
        .map((line) => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
        const cleanedRows = rows.map((row) =>
            row.map((cell) => cell.replace(/(^"|"$)/g, ""))
        );

      setCsvHeaders(cleanedHeaders);
      setCsvRows(cleanedRows);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to preview CSV:", error);
    }
  };

  return (
    <div className="container mt-2">
      <h2 className="mb-4">Task Details</h2>
      <p>
        <strong>Task ID:</strong> {task.task_id}
      </p>
      <p>
        <strong>Task type:</strong> {task.task_type}
      </p>
      <p>
        <strong>Uploaded by:</strong> {task.uploaded_by}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Created:</strong>{" "}
        {moment.tz(task.created, 'UTC')
          .format("MMM DD, YYYY, hh:mm:ss A")}
      </p>
      <p>
        <strong>Modified:</strong>{" "}
        {moment
          .tz(task.modified, 'UTC').format("MMM DD, YYYY, hh:mm:ss A")}
      </p>

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
          <StandardModal
            title="CSV Preview"
            className={"csv-preview-modal"}
            isOpen={isOpen}
            onClose={close}
            size="xl"
            isOverflowVisible={false}
          >
            <DataTable
              className="bulk-op-table"
              columns={csvHeaders.map((header) => ({
                Header: header,
                accessor: header,
              }))}
              data={csvRows.map((row) =>
                row.reduce((acc, value, index) => {
                  acc[csvHeaders[index]] = value;
                  return acc;
                }, {})
              )}
              defaultPageSize={5}
              showPagination={false}
            />
          </StandardModal>
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
}
