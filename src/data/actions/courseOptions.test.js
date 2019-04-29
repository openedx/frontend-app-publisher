import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import apiClient from '../apiClient';
import {
  requestCourseOptionsFail,
  requestCourseOptionsSuccess,
  requestCourseOptions,
  fetchCourseOptions,
} from './courseOptions';


const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(apiClient);
apiClient.isAccessTokenExpired = jest.fn();
apiClient.isAccessTokenExpired.mockReturnValue(false);

const uuid = '11111111-1111-1111-1111-111111111111';


describe('courseOptions fetch course actions', () => {
  afterEach(() => {
    mockClient.reset();
  });

  it('handles fetch success', () => {
    mockClient.onOptions(`http://localhost:18381/api/v1/courses/${uuid}/`)
      .replyOnce(200, JSON.stringify({
        actions: {
          PUT: {
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
      requestCourseOptions(uuid),
      requestCourseOptionsSuccess(uuid, {
        actions: {
          PUT: {
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

    return store.dispatch(fetchCourseOptions(uuid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch error code', () => {
    mockClient.onOptions(`http://localhost:18381/api/v1/courses/${uuid}/`)
      .replyOnce(500, '');

    const expectedActions = [
      requestCourseOptions(uuid),
      requestCourseOptionsFail(
        uuid,
        ['Could not get course information.', 'Request failed with status code 500.'],
      ),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseOptions(uuid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch with bad id', () => {
    const expectedActions = [
      requestCourseOptionsFail(
        'test',
        ['Could not get course information. test is not a valid course UUID.'],
      ),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseOptions('test')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch with bad data', () => {
    mockClient.onOptions(`http://localhost:18381/api/v1/courses/${uuid}/`)
      .replyOnce(200, {});

    const expectedActions = [
      requestCourseOptions(uuid),
      requestCourseOptionsFail(
        uuid,
        ['Could not get course information.', 'Did not understand response.'],
      ),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseOptions(uuid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
