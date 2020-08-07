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
      isCreating: false,
      isSubmittingEdit: false,
      error: null,
      courseSaved: false,
    };
  });

  it('initial state is valid', () => {
    expect(courseInfo(undefined, {})).toEqual({
      data: {},
      isFetching: false,
      isCreating: false,
      isSubmittingEdit: false,
      showCreateStatusAlert: false,
      error: null,
      courseSaved: false,
    });
  });

  it('course info request works', () => {
    expect(courseInfo(initialState, actions.requestCourseInfo('test')))
      .toEqual({
        data: {},
        isFetching: true,
        isCreating: false,
        isSubmittingEdit: false,
        error: null,
        courseSaved: false,
      });
  });

  it('course info receive works', () => {
    initialState.isFetching = true;
    expect(courseInfo(initialState, actions.requestCourseInfoSuccess('test', { key: 'DemoX+TestCourse' })))
      .toEqual({
        data: { key: 'DemoX+TestCourse' },
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: false,
        error: null,
        courseSaved: false,
      });
  });

  it('course info fail works', () => {
    initialState.isFetching = true;
    expect(courseInfo(initialState, actions.requestCourseInfoFail('test', 'failure')))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: false,
        error: 'failure',
        courseSaved: false,
      });
  });

  it('course info clear works', () => {
    initialState.error = 'error';
    expect(courseInfo(initialState, actions.clearCourseInfoErrors()))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: false,
        error: null,
        courseSaved: false,
      });
  });

  it('course create request works', () => {
    expect(courseInfo(initialState, actions.createNewCourse(courseData)))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: true,
        isSubmittingEdit: false,
        error: null,
        courseSaved: false,
      });
  });

  it('course create receive works', () => {
    expect(courseInfo(initialState, actions.createCourseSuccess(courseData)))
      .toEqual({
        data: courseData,
        error: null,
        isCreating: false,
        isSubmittingEdit: false,
        isFetching: false,
        courseSaved: false,
      });
  });

  it('course create fail works', () => {
    expect(courseInfo(initialState, actions.createCourseFail('failure')))
      .toEqual({
        data: {},
        error: 'failure',
        isCreating: false,
        isSubmittingEdit: false,
        isFetching: false,
        courseSaved: false,
      });
  });

  it('course edit request works', () => {
    expect(courseInfo(initialState, actions.editCourseInfo(courseData)))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: true,
        error: null,
        courseSaved: false,
      });
  });

  it('course edit receive works', () => {
    expect(courseInfo(initialState, actions.editCourseSuccess(courseData)))
      .toEqual({
        data: courseData,
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: false,
        error: null,
        courseSaved: true,
      });
  });

  it('course edit fail works', () => {
    expect(courseInfo(initialState, actions.editCourseFail('failure')))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: false,
        error: 'failure',
        courseSaved: false,
      });
  });

  it('course save clear works', () => {
    initialState.courseSaved = true;
    expect(courseInfo(initialState, actions.clearCourseSaved()))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: false,
        error: null,
        courseSaved: false,
      });
  });

  it('course create run request works', () => {
    expect(courseInfo(initialState, actions.createNewCourseRun()))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: true,
        isSubmittingEdit: false,
        error: null,
        courseSaved: false,
      });
  });

  it('course create run receive works', () => {
    expect(courseInfo(initialState, actions.createCourseRunSuccess(courseData)))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: false,
        showCreateStatusAlert: true,
        error: null,
        courseSaved: false,
      });
  });

  it('course create run fail works', () => {
    expect(courseInfo(initialState, actions.createCourseRunFail('failure')))
      .toEqual({
        data: {},
        isFetching: false,
        isCreating: false,
        isSubmittingEdit: false,
        error: 'failure',
        courseSaved: false,
      });
  });
});
