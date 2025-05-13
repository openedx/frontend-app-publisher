import React from 'react';
import '@testing-library/jest-dom';
import {
  render, screen, fireEvent, waitFor, within,
} from '@testing-library/react';
import BulkOperationDetails from './BulkOperationDetails';

const mockTask = {
  task_id: '123',
  task_type: 'course_create',
  uploaded_by: 'user@example.com',
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders task details correctly', () => {
    render(<BulkOperationDetails task={mockTask} />);
    const taskIdElement = screen.getByText('Task ID:', { selector: 'strong' }).closest('p');
    expect(within(taskIdElement).getByText('123')).toBeInTheDocument();
    expect(within(screen.getByText('Task type:', { selector: 'strong' }).closest('p')).getByText('course_create')).toBeInTheDocument();
    expect(within(screen.getByText('Uploaded by:', { selector: 'strong' }).closest('p')).getByText('user@example.com')).toBeInTheDocument();
    expect(within(screen.getByText('Status:', { selector: 'strong' }).closest('p')).getByText('completed')).toBeInTheDocument();
    expect(within(screen.getByText('Created:', { selector: 'strong' }).closest('p')).getByText('Jan 01, 2023, 12:00:00 AM')).toBeInTheDocument();
    expect(within(screen.getByText('Modified:', { selector: 'strong' }).closest('p')).getByText('Jan 02, 2023, 12:00:00 AM')).toBeInTheDocument();
  });

  it('renders download and preview buttons', () => {
    render(<BulkOperationDetails task={mockTask} />);
    const downloadButton = screen.getByRole('link', { name: /Download CSV/i });
    const previewButton = screen.getByRole('button', { name: /Preview CSV/i });

    expect(downloadButton).toHaveAttribute('href', mockTask.csv_file);
    expect(downloadButton).toHaveAttribute('target', '_blank');
    expect(previewButton).toBeInTheDocument();
  });

  it('fetches and displays CSV content on preview', async () => {
    render(<BulkOperationDetails task={mockTask} />);

    const previewButton = screen.getByRole('button', { name: /Preview CSV/i });
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(mockTask.csv_file);
    });
  });

  it('renders BulkOperationDetails and previews CSV', async () => {
    render(<BulkOperationDetails task={mockTask} />);

    const previewButton = screen.getByRole('button', { name: /Preview CSV/i });
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  it('renders task summary if present', () => {
    render(<BulkOperationDetails task={mockTask} />);
    expect(screen.getByText('Task Summary')).toBeInTheDocument();
    expect(screen.getByText(/success_count/i)).toBeInTheDocument();
    expect(screen.getByText(/created_products/i)).toBeInTheDocument();
    expect(screen.getByText(/"success_count": 2/)).toBeInTheDocument();
    expect(screen.getByText(/"total_products_count": 2/)).toBeInTheDocument();
  });
});
