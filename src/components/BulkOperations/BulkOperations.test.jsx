import React from 'react';
import {
  render, screen, fireEvent, within, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import BulkOperations from './index';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import '@testing-library/jest-dom';

export const mockedHistoricalTasks = [
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
  },
];

const createdTask = {
  ...mockedHistoricalTasks[0],
  id: 3,
  status: 'pending',
  csv_file: 'https://foo.com/hello.csv',
};

describe('BulkOperationsPage', () => {
  let post;
  let get;
  beforeAll(() => {
    get = jest.spyOn(DiscoveryDataApiService, 'fetchBulkOperations');
    post = jest.spyOn(DiscoveryDataApiService, 'createBulkOperation');
    get.mockResolvedValue({ data: { results: mockedHistoricalTasks } });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('initial render', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <BulkOperations />
        </IntlProvider>
      </MemoryRouter>,
    );
    const collapsible = await screen.findByText('Processing History');
    expect(collapsible).toBeInTheDocument();
    fireEvent.click(collapsible);

    expect(screen.getByText('bar.csv')).toBeInTheDocument();
    expect(screen.getByText('baz.csv')).toBeInTheDocument();
    expect(screen.getByTestId('dropzone-container')).toBeInTheDocument();
  });

  it('file upload', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <BulkOperations />
        </IntlProvider>
      </MemoryRouter>,
    );

    const dropZone = await screen.findByTestId('dropzone-container');
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [new File(['abc\n123\n456\n789'], 'hello.csv', { type: 'text/csv' })],
        types: ['Files'],
      },
    });

    await waitFor(() => expect(screen.queryByTestId('dropzone-container')).not.toBeInTheDocument());
    expect(screen.queryByTestId('file-preview')).toBeInTheDocument();
    expect(screen.getByText('hello.csv')).toBeInTheDocument();
    expect(screen.getByText('3 rows')).toBeInTheDocument();

    const uploadNewFile = screen.getByTestId('upload-new');
    fireEvent.click(uploadNewFile);
    expect(screen.queryByTestId('dropzone-container')).toBeInTheDocument();
    expect(screen.queryByTestId('file-preview')).not.toBeInTheDocument();
  });

  it.each([
    ['Successfully submitted task for bulk operation', true],
    ['Failed to submit task for processing', false],
  ])('submission', async (message, isSuccess) => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <BulkOperations />
        </IntlProvider>
      </MemoryRouter>,
    );

    if (isSuccess) {
      post.mockResolvedValue({ data: createdTask });
    } else {
      post.mockRejectedValue({ response: { status: 500 } });
    }

    const button = await screen.findByRole('button', { name: /Choose a Bulk Operation/i });
    fireEvent.click(button);
    const createButton = screen.getByRole('link', { name: 'Bulk Create' });
    fireEvent.click(createButton);

    const dropZone = screen.getByTestId('dropzone-container');
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [new File(['abc\n123\n456\n789'], 'hello.csv', { type: 'text/csv' })],
        types: ['Files'],
      },
    });

    const processButton = await screen.findByTestId('process-file');
    fireEvent.click(processButton);

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText(message)).toBeInTheDocument();
  });
});
