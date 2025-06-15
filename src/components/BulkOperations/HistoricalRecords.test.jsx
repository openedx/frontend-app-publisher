import {
  render, screen, fireEvent, within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import '@testing-library/jest-dom';
import HistoricalRecords from './HistoricalRecords';

import { mockedHistoricalTasks } from './BulkOperations.test';

describe('HistoricalRecords', () => {
  let get;

  beforeAll(() => {
    get = jest.spyOn(DiscoveryDataApiService, 'fetchBulkOperations');
  });

  beforeEach(() => {
    const firstPageResults = Array(5).fill(mockedHistoricalTasks).flat();
    const secondPageResults = Array(10).fill({ ...mockedHistoricalTasks[0], status: 'pending', csv_file: 'https://foo.com/empty.csv' });

    get.mockImplementation((page, size, status) => {
      if (status === 'failed') {
        return Promise.resolve({ data: { results: firstPageResults.filter(res => res.status === status), count: 5 } });
      }
      if (page === 0) {
        return Promise.resolve({ data: { results: firstPageResults, count: 20 } });
      }

      return Promise.resolve({ data: { results: secondPageResults, count: 20 } });
    });
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
    );

    const alertElement = await screen.findByRole('alert');
    expect(alertElement).toHaveTextContent(
      'Failed to fetch historical tasks. Please try reloading the page',
    );
  });

  it('history section pagination', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <HistoricalRecords />
        </IntlProvider>
      </MemoryRouter>,
    );

    const firstPageTexts = ['bar.csv', 'completed', 'baz.csv', 'failed'];
    const secondPageTexts = ['empty.csv', 'pending'];

    /* eslint-disable no-await-in-loop */

    // First Page
    for (const text of firstPageTexts) {
      expect(await screen.findAllByText(text)).toHaveLength(5);
    }
    for (const text of secondPageTexts) {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }

    // Second page
    const nextButton = screen.getByLabelText('Next, Page 2');
    fireEvent.click(nextButton);

    for (const text of secondPageTexts) {
      expect(await screen.findAllByText(text)).toHaveLength(10);
    }
    for (const text of firstPageTexts) {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }

    const footer = screen.getByTestId('table-footer');
    expect(within(footer).getByTestId('row-status')).toHaveTextContent('Showing 11 - 20 of 20.');
  });

  it('history section filtering', async () => {
    render(
      <MemoryRouter>
        <IntlProvider locale="en">
          <HistoricalRecords />
        </IntlProvider>
      </MemoryRouter>,
    );

    // Filtering by Status
    const select = screen.getByLabelText('Status');
    fireEvent.change(select, { target: { value: 'failed' } });

    const presentTexts = ['baz.csv', 'failed'];
    const absentTexts = ['bar.csv', 'empty.csv', 'completed', 'pending'];
    for (const text of presentTexts) {
      expect(await screen.findAllByText(text)).toHaveLength(5);
    }
    for (const text of absentTexts) {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }
    /* eslint-enable no-await-in-loop */
    const footer = screen.getByTestId('table-footer');
    expect(within(footer).getByTestId('row-status')).toHaveTextContent('Showing 1 - 5 of 5.');
  });
});
