import React from 'react';
import '@testing-library/jest-dom';
import {
  render, screen, fireEvent, within
} from '@testing-library/react';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import BulkOperations from './index';


const mockedHistoricalTasks = [
    {
        id: 1,
        uploaded_by: 'edx',
        task_type: 'course_create',
        status: 'completed',
        created: '2025-05-05T00:00:00Z',
        modified: '2025-05-05T00:00:00Z',
        csv_file: 'https://foo.com/bar.csv',
    },
    {
        id: 2,
        uploaded_by: 'edx',
        task_type: 'course_rerun',
        status: 'failed',
        created: '2025-05-05T00:00:00Z',
        modified: '2025-05-05T00:00:00Z',
        csv_file: 'https://foo.com/baz.csv',
    }
];

const createdTask = {
    ...mockedHistoricalTasks[0],
    id: 3,
    status: 'pending',
    csv_file: 'https://foo.com/hello.csv'
}

describe('BulkOperationsPage', () => {
  beforeEach(() => {
    const get = jest.spyOn(DiscoveryDataApiService, 'fetchBulkOperations')
    const post = jest.spyOn(DiscoveryDataApiService, 'createBulkOperation')
    get.mockResolvedValue({ data: { results: mockedHistoricalTasks} });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initial render', async () => {
    render(<BulkOperations />);

    const collapsible = screen.getByText('Processing History')
    expect(collapsible).toBeInTheDocument()
    fireEvent.click(collapsible)

    expect(screen.getByText('bar.csv')).toBeInTheDocument()
    expect(screen.getByText('baz.csv')).toBeInTheDocument()
    expect(screen.getByTestId('dropzone-container')).toBeInTheDocument()

  });

  it('filters history based on chosen operation', async () => {
    render(<BulkOperations />);

    const button = screen.getByRole('button', {name: /Choose a Bulk Operation/i})
    fireEvent.click(button)
    const createButton = screen.getByRole('button', {name: 'Bulk Create'})
    fireEvent.click(createButton)

    expect(screen.queryByText('bar.csv')).toBeInTheDocument()
    expect(screen.queryByText('baz.csv')).not.toBeInTheDocument()

  });

  it('file upload', async () => {
    render(<BulkOperations />);
    
    const dropZone = screen.getByTestId('dropzone-container')

    fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [new File(['abc\n123\n456\n789'], 'hello.csv', {type: 'text/csv'})],
        },
    })

    expect(screen.queryByTestId('dropzone-container')).not.toBeInTheDocument()
    expect(screen.queryByTestId('file-preview')).toBeInTheDocument()
    expect(screen.getByText('hello.csv')).toBeInTheDocument()
    expect(screen.getByText('3 rows')).toBeInTheDocument()


    const uploadNewFile = screen.getByTestId('upload-new')
    fireEvent.click(uploadNewFile)

    expect(screen.queryByTestId('dropzone-container')).toBeInTheDocument()
    expect(screen.queryByTestId('file-preview')).not.toBeInTheDocument()

  });

  it.each([
    ['Successfully submitted task for bulk operation', 2, true],
    ['Failed to submit task for processing', 1, false]
  ])('submission', async (message, fileNameInstances, isSuccess) => {

    if (isSuccess){
        post.mockResolvedValue({ data: createdTask});
    }
    else {
        post.mockRejectedValue({response: {status: 500}});
    }

    render(<BulkOperations />);

    const button = screen.getByRole('button', {name: /Choose a Bulk Operation/i})
    fireEvent.click(button)
    const createButton = screen.getByRole('button', {name: 'Bulk Create'})
    fireEvent.click(createButton)

    const dropZone = screen.getByTestId('dropzone-container')

    fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [new File(['abc\n123\n456\n789'], 'hello.csv', {type: 'text/csv'})],
        },
    })

    const processButton = screen.getByTestId('process-file')
    fireEvent.click(processButton);

    const alert = screen.getByRole('alert')

    expect(within(alert).getByText(message)).toBeInTheDocument()

    // Success: the filename is on the csv preview as well as the historical records section
    // Failure: the filename is only on the csv preview section 
    expect(screen.getAllByText('hello.csv')).toHaveLength(fileNameInstances)

  });
});
