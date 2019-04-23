import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import apiClient from '../apiClient';
import {
  requestStafferOptionsFail,
  requestStafferOptionsSuccess,
  requestStafferOptions,
  fetchStafferOptions,
} from './stafferOptions';


const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(apiClient);
apiClient.isAccessTokenExpired = jest.fn();
apiClient.isAccessTokenExpired.mockReturnValue(false);

const stafferOptions = {
  actions: {
    POST: {
      position: {
        children: {
          organization: {
            choices: [
              { display_name: 'edX', value: 1 },
              { display_name: 'bananasX', value: 2 },
            ],
          },
        },
      },
    },
  },
};

describe('stafferOptions fetch staffer options actions', () => {
  const url = 'http://localhost:18381/api/v1/people/';

  afterEach(() => {
    mockClient.reset();
  });

  it('handles fetch success', () => {
    mockClient.onOptions(url)
      .replyOnce(200, JSON.stringify(stafferOptions));

    const expectedActions = [
      requestStafferOptions(),
      requestStafferOptionsSuccess(stafferOptions),
    ];
    const store = mockStore();

    return store.dispatch(fetchStafferOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch error code', () => {
    mockClient.onOptions(url).replyOnce(500, '');

    const expectedActions = [
      requestStafferOptions(),
      requestStafferOptionsFail('Could not get instructor information. Request failed with status code 500.'),
    ];
    const store = mockStore();

    return store.dispatch(fetchStafferOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch with bad data', () => {
    mockClient.onOptions(url).replyOnce(200, {});

    const expectedActions = [
      requestStafferOptions(),
      requestStafferOptionsFail('Could not get instructor information. Did not understand response.'),
    ];
    const store = mockStore();

    return store.dispatch(fetchStafferOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
