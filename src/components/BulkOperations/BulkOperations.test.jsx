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
    )
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
    )

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
    )

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

  it('history section failure', async () => {
    get.mockRejectedValue(new Error('API Error'));
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <BulkOperations />
        </IntlProvider>
      </MemoryRouter>,
    )

    const alertElement = await screen.findByRole('alert');
    expect(alertElement).toHaveTextContent(
      'Failed to fetch historical tasks. Please try reloading the page'
    );
  });


  it('history section pagination and filtering', async () => {
    let firstPageResults = Array(5).fill(mockedHistoricalTasks).flat();
    let secondPageResults = Array(10).fill({...mockedHistoricalTasks[0], status: 'pending', csv_file: 'https://foo.com/empty.csv'})

    get.mockImplementation((page, size, status) => {
      if (status === 'failed') {
        return Promise.resolve({data: {results: firstPageResults.filter(res => res.status === status), count: 5}});
      }
      if (page == 0) {
        return Promise.resolve({data: {results: firstPageResults, count: 20}});
      }
      else {
        return Promise.resolve({data: {results: secondPageResults, count: 20}})
      }
    })

    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <BulkOperations />
        </IntlProvider>
      </MemoryRouter>,
    )

    let firstPageTexts = ['bar.csv', 'completed', 'baz.csv', 'failed']
    let secondPageTexts = ['empty.csv', 'pending']

    // First Page
    for (let text of firstPageTexts){
      expect(await screen.findAllByText(text)).toHaveLength(5);
    }
    for (let text of secondPageTexts){
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }

    // Second page
    const nextButton = screen.getByLabelText('Next, Page 2');
    fireEvent.click(nextButton);

    for (let text of secondPageTexts){
      expect(await screen.findAllByText(text)).toHaveLength(10);
    }
    for (let text of firstPageTexts){
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }

    const footer = screen.getByTestId('table-footer')
    expect(within(footer).getByTestId('row-status')).toHaveTextContent('Showing 11 - 20 of 20.')

    // Filtering by Status
    const select = screen.getByLabelText('Status')
    fireEvent.change(select, {target: {value: 'failed'}})

    const presentTexts = ['baz.csv', 'failed']
    const absentTexts = ['bar.csv', 'empty.csv', 'completed', 'pending']
    for (let text of presentTexts){
      expect(await screen.findAllByText(text)).toHaveLength(5);
    }
    for (let text of absentTexts){
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }

    expect(within(footer).getByTestId('row-status')).toHaveTextContent('Showing 1 - 5 of 5.')

  });

});
