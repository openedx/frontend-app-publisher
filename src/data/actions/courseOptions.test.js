import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  requestCourseOptionsFail,
  requestCourseOptionsSuccess,
  requestCourseOptions,
  fetchCourseOptions,
} from './courseOptions';

const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(axios);

describe('courseOptions fetch course actions', () => {
  afterEach(() => {
    mockClient.reset();
  });

  it('handles fetch success', () => {
    mockClient.onOptions('http://localhost:18381/api/v1/courses/')
      .replyOnce(200, JSON.stringify({
        actions: {
          POST: {
            level_type: {
              choices: [
                { display_name: 'Beginner', value: 'beginner' },
                { display_name: 'Intermediate', value: 'intermediate' },
                { display_name: 'Advanced', value: 'advanced' },
              ],
            },
            subjects: {
              child: {
                choices: [
                  { display_name: 'Business', value: 'business' },
                  { display_name: 'Chemistry', value: 'chemistry' },
                  { display_name: 'English', value: 'english' },
                  { display_name: 'Security', value: 'security' },
                ],
              },
            },
          },
        },
      }));

    const expectedActions = [
      requestCourseOptions(),
      requestCourseOptionsSuccess({
        actions: {
          POST: {
            level_type: {
              choices: [
                { display_name: 'Beginner', value: 'beginner' },
                { display_name: 'Intermediate', value: 'intermediate' },
                { display_name: 'Advanced', value: 'advanced' },
              ],
            },
            subjects: {
              child: {
                choices: [
                  { display_name: 'Business', value: 'business' },
                  { display_name: 'Chemistry', value: 'chemistry' },
                  { display_name: 'English', value: 'english' },
                  { display_name: 'Security', value: 'security' },
                ],
              },
            },
          },
        },
      }),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch error code', () => {
    mockClient.onOptions('http://localhost:18381/api/v1/courses/')
      .replyOnce(500, '');

    const expectedActions = [
      requestCourseOptions(),
      requestCourseOptionsFail(['Could not get course information.', 'Request failed with status code 500.']),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch with bad data', () => {
    mockClient.onOptions('http://localhost:18381/api/v1/courses/')
      .replyOnce(200, {});

    const expectedActions = [
      requestCourseOptions(),
      requestCourseOptionsFail(['Could not get course information.', 'Did not understand response.']),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
