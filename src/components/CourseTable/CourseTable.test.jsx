import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import CourseTable from './index';

const mockStore = configureStore([thunk]);
const store = mockStore({});

describe.skip('CourseTable', () => {
  // TODO: The table is not rendering properly and fails on the assertion.
  it('shows a table', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable />
        </MemoryRouter>
      </Provider>,
    );
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
  });

  it('hides table and button when blacklisted', async () => {
    const publisherUserInfo = { organizations: [{ key: 'fake1', name: 'fake_name1' }] };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable publisherUserInfo={publisherUserInfo} />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => expect(screen.queryByRole('table')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('button')).not.toBeInTheDocument());
  });

  it('displays table and button when not blacklisted', async () => {
    const publisherUserInfo = { organizations: [{ key: 'fake2', name: 'fake_name2' }] };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable publisherUserInfo={publisherUserInfo} />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button')).toBeInTheDocument());
  });

  it('displays table and button when user has no orgs', async () => {
    const publisherUserInfo = { organizations: [] };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable publisherUserInfo={publisherUserInfo} />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button')).toBeInTheDocument());
  });
});
