import React from 'react';
import '@testing-library/jest-dom';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import BulkOperationDetails from './BulkOperationDetails';

const mockBulkOperationTask = {
  task_id: 123,
  task_type: 'course_create',
  uploaded_by: 'test-user',
  status: 'completed',
  created: '2023-01-01T00:00:00Z',
  modified: '2023-01-02T00:00:00Z',
  csv_file: 'https://example.com/file.csv',
  task_summary: {
    errors: {},
    others: [
      'Course with key edX+CSL-700 already exists. Skipping creation',
    ],
    failure_count: 0,
    success_count: 2,
    created_products: [
      '41413e7e-0e08-4e43-a795-87130bd08ac3 - Intro to Course Loader',
      'b717187c-b8ae-47ac-b65b-ac2274e712db - Intro to Course Loader',
    ],
    total_products_count: 2,
    updated_products_count: 0,
  },
};

const csvContent = '"name","image"\n"Test Name","https://example.com/image.jpg"';

describe('BulkOperationDetails', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(csvContent),
    });
    render(
      <IntlProvider locale="en">
        <BulkOperationDetails task={mockBulkOperationTask} />
      </IntlProvider>,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders task details correctly', () => {
    expect(screen.getByRole('columnheader', { name: 'Field' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: 'Task ID' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '123' })).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: 'Task type' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'course_create' })).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: 'Uploaded by' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'test-user' })).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'completed' })).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: 'Created' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Jan 01, 2023, 12:00:00 AM' })).toBeInTheDocument();

    expect(screen.getByRole('cell', { name: 'Modified' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Jan 02, 2023, 12:00:00 AM' })).toBeInTheDocument();
  });

  it('renders download and preview buttons', () => {
    const downloadButton = screen.getByRole('link', { name: /Download CSV/i });
    const previewButton = screen.getByRole('button', { name: /Preview CSV/i });

    expect(downloadButton).toHaveAttribute('href', mockBulkOperationTask.csv_file);
    expect(downloadButton).toHaveAttribute('target', '_blank');
    expect(previewButton).toBeInTheDocument();
  });

  it('fetches and displays CSV content on preview', async () => {
    const previewButton = screen.getByRole('button', { name: /Preview CSV/i });
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(mockBulkOperationTask.csv_file);
    });
  });

  it('renders BulkOperationDetails and previews CSV', async () => {
    const previewButton = screen.getByRole('button', { name: /Preview CSV/i });
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('Test Name')).toBeInTheDocument();

      expect(screen.getByText('image')).toBeInTheDocument();
      expect(screen.getByText('View Image')).toBeInTheDocument();
    });
  });

  it('renders task summary if present', () => {
    expect(screen.getByText('Task Summary')).toBeInTheDocument();
    expect(screen.getByText(/success_count/i)).toBeInTheDocument();
    expect(screen.getByText(/created_products/i)).toBeInTheDocument();
    expect(screen.getByText(/"success_count": 2/)).toBeInTheDocument();
    expect(screen.getByText(/"total_products_count": 2/)).toBeInTheDocument();
  });
});
