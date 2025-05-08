import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import CourseTable from './index';

const mockStore = configureStore([thunk]);
const store = mockStore({});

describe('CourseTable', () => {
  it('shows a table', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable />
        </MemoryRouter>
      </Provider>,
    );
    waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
  });

  it('hides table and button when blacklisted', () => {
    const publisherUserInfo = { organizations: [{ key: 'fake1', name: 'fake_name1' }] };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable publisherUserInfo={publisherUserInfo} />
        </MemoryRouter>
      </Provider>,
    );

    waitFor(() => expect(screen.queryByRole('table')).not.toBeInTheDocument());
    waitFor(() => expect(screen.queryByRole('button')).not.toBeInTheDocument());
  });

  it('displays table and button when not blacklisted', () => {
    const publisherUserInfo = { organizations: [{ key: 'fake2', name: 'fake_name2' }] };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable publisherUserInfo={publisherUserInfo} />
        </MemoryRouter>
      </Provider>,
    );

    waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    waitFor(() => expect(screen.getByRole('button')).toBeInTheDocument());
  });

  it('displays table and button when user has no orgs', () => {
    const publisherUserInfo = { organizations: [] };
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CourseTable publisherUserInfo={publisherUserInfo} />
        </MemoryRouter>
      </Provider>,
    );

    waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    waitFor(() => expect(screen.getByRole('button')).toBeInTheDocument());
  });
});
