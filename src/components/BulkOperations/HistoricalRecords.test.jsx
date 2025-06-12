import {
  render, screen, fireEvent, within, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import BulkOperations from './index';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import '@testing-library/jest-dom';
import HistoricalRecords from './HistoricalRecords.jsx';

import {mockedHistoricalTasks} from './BulkOperations.test.jsx'

describe('HistoricalRecords', () => {
  let get;

  beforeAll(() => {
    get = jest.spyOn(DiscoveryDataApiService, 'fetchBulkOperations');
    post = jest.spyOn(DiscoveryDataApiService, 'createBulkOperation');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('history section failure', async () => {
    get.mockRejectedValue(new Error('API Error'));
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <HistoricalRecords />
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
          <HistoricalRecords />
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
