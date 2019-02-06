import * as actions from '../actions/courseInfo';

import courseInfo from './courseInfo';


describe('courseInfo reducer', () => {
  let initialState;
  const courseData = {
    org: 'edx',
    title: 'Hello',
    number: 'edx101',
    mode: 'verified',
    price: 100.00,
  };

  beforeEach(() => {
    initialState = {
      data: {},
      isFetching: false,
      error: null,
    };
  });

  it('initial state is valid', () => {
    expect(courseInfo(undefined, {})).toEqual({
      data: {},
      isFetching: false,
      error: null,
    });
  });

  it('course info request works', () => {
    expect(courseInfo(initialState, actions.requestCourseInfo('test')))
      .toEqual({
        data: {},
        isFetching: true,
        error: null,
      });
  });

  it('course info receive works', () => {
    initialState.isFetching = true;
    expect(courseInfo(initialState, actions.requestCourseInfoSuccess('test', { key: 'DemoX+TestCourse' })))
      .toEqual({
        data: { key: 'DemoX+TestCourse' },
        isFetching: false,
        error: null,
      });
  });

  it('course info fail works', () => {
    initialState.isFetching = true;
    expect(courseInfo(initialState, actions.requestCourseInfoFail('test', 'failure')))
      .toEqual({
        data: {},
        isFetching: false,
        error: 'failure',
      });
  });

  it('course create request works', () => {
    expect(courseInfo(initialState, actions.createNewCourse(courseData)))
      .toEqual(initialState);
  });

  it('course create receive works', () => {
    expect(courseInfo(initialState, actions.createCourseSuccess(courseData)))
      .toEqual({
        data: courseData,
        error: null,
        isFetching: false,
      });
  });

  it('course create fail works', () => {
    expect(courseInfo(initialState, actions.createCourseFail('failure')))
      .toEqual({
        data: {},
        error: 'failure',
        isFetching: false,
      });
  });

  it('course edit request works', () => {
    expect(courseInfo(initialState, actions.editCourseInfo(courseData)))
      .toEqual({
        data: {},
        isFetching: false,
        error: null,
      });
  });

  it('course edit receive works', () => {
    expect(courseInfo(initialState, actions.editCourseSuccess(courseData)))
      .toEqual({
        data: courseData,
        isFetching: false,
        error: null,
      });
  });

  it('course edit fail works', () => {
    expect(courseInfo(initialState, actions.editCourseFail('failure')))
      .toEqual({
        data: {},
        isFetching: false,
        error: 'failure',
      });
  });
});
