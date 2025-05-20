import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import CourseTable from './index';
import '@testing-library/jest-dom';

const mockStore = configureStore([thunk]);
const store = mockStore({
  table: {
    loading: false,
    error: null,
    data: {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          key: 'hogwarts+123',
          uuid: '04c512ed-1b2b-461c-a715-00a0f8cba514',
          title: 'Hast La Vista',
          course_run_statuses: [
            'archived',
          ],
          editors: [
            {
              id: 8,
              user: {
                id: 1,
                full_name: 'edx',
                email: 'edx@example.com',
              },
              course: '04c512ed-1b2b-461c-a715-00a0f8cba514',
            },
          ],
        },
        {
          key: 'hogwarts+111123',
          uuid: '7a6d5b85-fff2-4944-a7bc-a82890de3e7c',
          title: 'New Era Wisdom',
          course_run_statuses: [
            'archived',
          ],
          editors: [
            {
              id: 17,
              user: {
                id: 1,
                full_name: 'edx',
                email: 'edx@example.com',
              },
              course: '7a6d5b85-fff2-4944-a7bc-a82890de3e7c',
            },
          ],
        },
      ],
    },
  },
});

describe('CourseTable', () => {
  it('shows a table', async () => {
    render(
      <IntlProvider locale="en">
        <Provider store={store}>
          <MemoryRouter>
            <CourseTable />
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
    );
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: 'New course' })).toBeInTheDocument());
  });
});
