import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BulkOperationDetails from './BulkOperationDetails';
import moment from 'moment-timezone';

const mockCsv = `"name","image"\n"Test Name","http://example.com/image.jpg"\n"Another Name",""`;

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve(mockCsv),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockTask = {
  task_id: '12345',
  task_type: 'Upload',
  uploaded_by: 'admin@example.com',
  status: 'Completed',
  created: '2023-09-01T12:00:00Z',
  modified: '2023-09-02T12:00:00Z',
  csv_file: '/test.csv',
  task_summary: {
    success: 2,
    failed: 1,
  },
};

describe('BulkOperationDetails', () => {
  it('renders task details correctly', () => {
    render(<BulkOperationDetails task={mockTask} />);

    expect(screen.getByText('Task Details')).toBeInTheDocument();
    expect(screen.getByText('Task ID:')).toBeInTheDocument();
    expect(screen.getByText(mockTask.task_id)).toBeInTheDocument();
    expect(screen.getByText('Task type:')).toBeInTheDocument();
    expect(screen.getByText(mockTask.task_type)).toBeInTheDocument();
    expect(screen.getByText('Uploaded by:')).toBeInTheDocument();
    expect(screen.getByText(mockTask.uploaded_by)).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText(mockTask.status)).toBeInTheDocument();
    expect(screen.getByText('Created:')).toBeInTheDocument();
    expect(screen.getByText(moment(mockTask.created).tz('UTC').format('MMM DD, YYYY, hh:mm:ss A'))).toBeInTheDocument();
    expect(screen.getByText('Modified:')).toBeInTheDocument();
    expect(screen.getByText(moment(mockTask.modified).tz('UTC').format('MMM DD, YYYY, hh:mm:ss A'))).toBeInTheDocument();
  });

  it('renders download and preview buttons', () => {
    render(<BulkOperationDetails task={mockTask} />);
    expect(screen.getByText('Download CSV')).toBeInTheDocument();
    expect(screen.getByText('Preview CSV')).toBeInTheDocument();
  });

  it('opens modal and displays CSV data on Preview click', async () => {
    render(<BulkOperationDetails task={mockTask} />);
    fireEvent.click(screen.getByText('Preview CSV'));

    await waitFor(() => {
      expect(screen.getByText('CSV Preview')).toBeInTheDocument();
    });

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('image')).toBeInTheDocument();

    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText('Another Name')).toBeInTheDocument();
    expect(screen.getByText('View Image')).toBeInTheDocument();
  });

  it('renders task summary when provided', () => {
    render(<BulkOperationDetails task={mockTask} />);
    expect(screen.getByText('Task Summary')).toBeInTheDocument();
    expect(screen.getByText(/success/)).toBeInTheDocument();
  });

  it('handles missing image field gracefully', async () => {
    render(<BulkOperationDetails task={mockTask} />);
    fireEvent.click(screen.getByText('Preview CSV'));

    await waitFor(() => {
      expect(screen.getByText('CSV Preview')).toBeInTheDocument();
    });

    const imageLinks = screen.getAllByText('View Image');
    expect(imageLinks.length).toBe(1);
    expect(imageLinks[0]).toHaveAttribute('href', 'http://example.com/image.jpg');
  });
});
