import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import apiClient from '../apiClient';

import {
  failCourseInfo,
  fetchCourseInfo,
  receiveCourseInfo,
  requestCourseInfo,
  courseCreateFail,
  courseCreateSuccess,
  createNewCourse,
} from './courseInfo';
import * as types from '../constants/courseInfo';

const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(apiClient);

const uuid = '11111111-1111-1111-1111-111111111111';


describe('courseInfo fetch course actions', () => {
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

describe('courseInfo create course actions', () => {
  it('should start new course', () => {
    const courseData = { name: 'test course data' };
    const expectedAction = {
      type: types.CREATE_COURSE,
      courseData,
    };
    expect(createNewCourse(courseData)).toEqual(expectedAction);
  });
  it('should succeed', () => {
    const data = { name: 'test course data' };
    const expectedAction = {
      type: types.CREATE_COURSE_SUCCESS,
      data,
    };
    expect(courseCreateSuccess(data)).toEqual(expectedAction);
  });
  it('should fail', () => {
    const error = 'Test error';
    const expectedAction = {
      type: types.CREATE_COURSE_FAIL,
      error,
    };
    expect(courseCreateFail(error)).toEqual(expectedAction);
  });
});
