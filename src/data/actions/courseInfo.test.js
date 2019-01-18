import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import apiClient from '../apiClient';

import {
  failCourseInfo,
  fetchCourseInfo,
  receiveCourseInfo,
  requestCourseInfo,
} from './courseInfo';

const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(apiClient);

const uuid = '11111111-1111-1111-1111-111111111111';


describe('courseInfo actions', () => {
  afterEach(() => {
    mockClient.reset();
  });

  it('handles fetch success', () => {
    mockClient.onGet(`http://localhost:18381/api/v1/courses/${uuid}/`)
      .replyOnce(200, JSON.stringify({
        key: 'DemoX+TestCourse',
      }));

    const expectedActions = [
      requestCourseInfo(uuid),
      receiveCourseInfo(uuid, { key: 'DemoX+TestCourse' }),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseInfo(uuid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch error code', () => {
    mockClient.onGet(`http://localhost:18381/api/v1/courses/${uuid}/`)
      .replyOnce(500, '');

    const expectedActions = [
      requestCourseInfo(uuid),
      failCourseInfo(
        uuid,
        'Could not get course information. Error: Request failed with status code 500',
      ),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseInfo(uuid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch with bad id', () => {
    const expectedActions = [
      failCourseInfo(
        'test',
        'Could not get course information. test is not a valid course UUID.',
      ),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseInfo('test')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch with bad data', () => {
    mockClient.onGet(`http://localhost:18381/api/v1/courses/${uuid}/`)
      .replyOnce(200, {});

    const expectedActions = [
      requestCourseInfo(uuid),
      failCourseInfo(
        uuid,
        'Could not get course information. Error: Did not understand response.',
      ),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseInfo(uuid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
