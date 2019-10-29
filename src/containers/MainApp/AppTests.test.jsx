import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';

import configureStore from 'redux-mock-store';
import MainApp from './index';
import TableComponent from '../../components/TableComponent/index';

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
  const authentication = {
    userId: 9,
    username: 'user9',
  };
  const initialState = {
    authentication,
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

  const AppWrapper = initialEntries => (
    <IntlProvider locale="en">
      <Provider store={mockStore(initialState)}>
        <MemoryRouter initialEntries={initialEntries}>
          <MainApp />
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );
  return mount(AppWrapper(initialRoute));
}

describe('App', () => {
  let screen;

  beforeEach(() => {
    process.env.STUDIO_BASE_URL = 'http://localhost:18010/';
  });

  it('renders entire Course Dashboard at route / with course list', () => {
    screen = renderAppWithState(['/']);

    // New Course Button should be present
    expect(screen.find('div.btn-group a button').text()).toEqual('New Course');

    // Table Should be present at main route with data
    expect(screen.find(TableComponent)).toHaveLength(1);
    expect(screen.find(TableComponent).find('tbody tr')).toHaveLength(1);
    expect(screen.find(TableComponent).find('tbody tr Link a').text()).toEqual('edx101');
  });
});
