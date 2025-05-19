import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import CourseTable from './index';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import "@testing-library/jest-dom"

const mockStore = configureStore([thunk]);
const store = mockStore({
  table: {
    "loading": false,
    "error": null,
    "data": {
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
            {
                "key": "hogwarts+123",
                "uuid": "04c512ed-1b2b-461c-a715-00a0f8cba514",
                "title": "Hast La Vista",
                "course_run_statuses": [
                    "archived"
                ],
                "editors": [
                    {
                        "id": 8,
                        "user": {
                            "id": 1,
                            "full_name": "edx",
                            "email": "edx@example.com"
                        },
                        "course": "04c512ed-1b2b-461c-a715-00a0f8cba514"
                    }
                ]
            },
            {
                "key": "hogwarts+111123",
                "uuid": "7a6d5b85-fff2-4944-a7bc-a82890de3e7c",
                "title": "New Era Wisdom",
                "course_run_statuses": [
                    "archived"
                ],
                "editors": [
                    {
                        "id": 17,
                        "user": {
                            "id": 1,
                            "full_name": "edx",
                            "email": "edx@example.com"
                        },
                        "course": "7a6d5b85-fff2-4944-a7bc-a82890de3e7c"
                    }
                ]
            },
        ]
    },
}
});

describe('CourseTable', () => {
  // TODO: The table is not rendering properly and fails on the assertion.
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
  });

  it('hides table and button when blacklisted', async () => {
    const publisherUserInfo = { organizations: [{ key: 'fake1', name: 'fake_name1' }] };
    render(
      <IntlProvider locale="en">
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable />
        </MemoryRouter>
      </Provider>
      </IntlProvider>,
    );

    await waitFor(() => expect(screen.queryByRole('table')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('button')).not.toBeInTheDocument());
  });

  it('displays table and button when not blacklisted', async () => {
    const publisherUserInfo = { organizations: [{ key: 'fake2', name: 'fake_name2' }] };
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
    await waitFor(() => expect(screen.getByRole('button', {name: 'New course'})).toBeInTheDocument());
  });

  it('displays table and button when user has no orgs', async () => {
    const publisherUserInfo = { organizations: [] };
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
    await waitFor(() => expect(screen.getByRole('button', {name: 'New course'})).toBeInTheDocument());
  });
});
