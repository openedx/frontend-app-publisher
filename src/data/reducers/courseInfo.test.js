import * as actions from '../actions/courseInfo';

import courseInfo from './courseInfo';


describe('courseInfo reducer', () => {
  const oldState = { // overwritten as old state for actions
    data: { nope: 'bad data' },
    isFetching: true,
    error: 'error occurred',
  };

  const courseData = {
    org: 'edx',
    title: 'Hello',
    number: 'edx101',
    mode: 'verified',
    price: 100.00,
  };

  it('initial state is valid', () => {
    expect(courseInfo(undefined, {})).toEqual({
      data: {},
      isFetching: false,
      error: null,
    });
  });

  it('course info request works', () => {
    expect(courseInfo(oldState, actions.requestCourseInfo('test')))
      .toEqual({
        data: {},
        isFetching: true,
        error: null,
      });
  });

  it('course info receive works', () => {
    expect(courseInfo(oldState, actions.receiveCourseInfo('test', { key: 'DemoX+TestCourse' })))
      .toEqual({
        data: { key: 'DemoX+TestCourse' },
        isFetching: false,
        error: null,
      });
  });

  it('course info fail works', () => {
    expect(courseInfo(oldState, actions.failCourseInfo('test', 'failure')))
      .toEqual({
        data: {},
        isFetching: false,
        error: 'failure',
      });
  });

  it('course create request works', () => {
    expect(courseInfo(oldState, actions.createNewCourse(courseData)))
      .toEqual({
        data: {},
        isFetching: false,
        error: null,
      });
  });

  it('course create receive works', () => {
    expect(courseInfo(oldState, actions.courseCreateSuccess(courseData)))
      .toEqual({
        data: courseData,
        isFetching: false,
        error: null,
      });
  });

  it('course create fail works', () => {
    expect(courseInfo(oldState, actions.courseCreateFail('failure')))
      .toEqual({
        data: {},
        isFetching: false,
        error: 'failure',
      });
  });
});
