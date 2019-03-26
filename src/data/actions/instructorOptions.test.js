import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import apiClient from '../apiClient';
import {
  requestInstructorOptionsFail,
  requestInstructorOptionsSuccess,
  requestInstructorOptions,
  fetchInstructorOptions,
} from './instructorOptions';


const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(apiClient);

const instructorOptions = {
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

describe('instructorOptions fetch instructor options actions', () => {
  const url = 'http://localhost:18381/api/v1/people/';

  afterEach(() => {
    mockClient.reset();
  });

  it('handles fetch success', () => {
    mockClient.onOptions(url)
      .replyOnce(200, JSON.stringify(instructorOptions));

    const expectedActions = [
      requestInstructorOptions(),
      requestInstructorOptionsSuccess(instructorOptions),
    ];
    const store = mockStore();

    return store.dispatch(fetchInstructorOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch error code', () => {
    mockClient.onOptions(url).replyOnce(500, '');

    const expectedActions = [
      requestInstructorOptions(),
      requestInstructorOptionsFail('Could not get instructor information. Error: Request failed with status code 500'),
    ];
    const store = mockStore();

    return store.dispatch(fetchInstructorOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch with bad data', () => {
    mockClient.onOptions(url).replyOnce(200, {});

    const expectedActions = [
      requestInstructorOptions(),
      requestInstructorOptionsFail('Could not get instructor information. Error: Did not understand response'),
    ];
    const store = mockStore();

    return store.dispatch(fetchInstructorOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
