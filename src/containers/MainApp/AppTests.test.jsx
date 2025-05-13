import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import configureStore from 'redux-mock-store';
import MainApp from './index';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const courseData = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      key: 'edx+edx101',
      uuid: '55b38bcf-1956-44ce-92cc-accb18d20b74',
      title: 'edx101',
      owners: [
        {
          uuid: '4c30506c-4150-4243-90a1-4e62f1ce3718',
          key: 'edx',
          name: 'edx',
          certificate_logo_image_url: null,
          description: '',
          homepage_url: null,
          tags: [],
          logo_image_url: null,
          marketing_url: null,
        },
      ],
      course_run_statuses: [],
      editors: [],
      modified: '2019-04-30T16:31:08.182755Z',
    },
  ],
};

function renderAppWithState(initialRoute) {
  const initialState = {
    table: {
      data: courseData,
      error: null,
      loading: false,
      editorFilterOptions: [],
      editorFilterOptionsError: null,
    },
    darkMode: {
      darkModeOn: false,
    },
  };
  const contextValue = {
    authenticatedUser: {
      username: 'user9',
    },
    config: {},
  };

  const AppWrapper = () => (
    <IntlProvider locale="en">
      <Provider store={mockStore(initialState)}>
        <MemoryRouter>
          <AppContext.Provider
            store={mockStore(initialState)}
            value={contextValue}
          >
            <MainApp />
          </AppContext.Provider>
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );
  return render(AppWrapper(initialRoute));
}

describe('App', () => {
  it('renders entire Course Dashboard at route / with course list', async () => {
    renderAppWithState(['/']);

    // New Course Button should be present
    const newCourseBtn = await screen.findAllByRole('button')[2];
    waitFor(() => expect(newCourseBtn).toHaveTextContent('New course'));
    // Table Should be present at main route with data
    waitFor(() => expect(screen.findAllByRole('table')).toBeInTheDocument());
    waitFor(() => expect(screen.findAllByRole('row')).toHaveLength(1));
    const link = await screen.findByRole('link', { name: 'edx101' });
    waitFor(() => expect(link).toHaveTextContent('edx101'));
  });
});
