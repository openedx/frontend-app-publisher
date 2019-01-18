import {
  failCourseInfo,
  receiveCourseInfo,
  requestCourseInfo,
} from '../actions/courseInfo';

import courseInfo from './courseInfo';


describe('courseInfo reducer', () => {
  const oldState = { // overwritten as old state for actions
    data: { nope: 'bad data' },
    isFetching: true,
    error: 'error occurred',
  };

  it('initial state is valid', () => {
    expect(courseInfo(undefined, {})).toEqual({
      data: {},
      isFetching: false,
      error: null,
    });
  });

  it('request works', () => {
    expect(courseInfo(oldState, requestCourseInfo('test')))
      .toEqual({
        data: {},
        isFetching: true,
        error: null,
      });
  });

  it('receive works', () => {
    expect(courseInfo(oldState, receiveCourseInfo('test', { key: 'DemoX+TestCourse' })))
      .toEqual({
        data: { key: 'DemoX+TestCourse' },
        isFetching: false,
        error: null,
      });
  });

  it('fail works', () => {
    expect(courseInfo(oldState, failCourseInfo('test', 'failure')))
      .toEqual({
        data: {},
        isFetching: false,
        error: 'failure',
      });
  });
});
