import {
  courseSubmittingInfo,
  courseSubmittingCancel,
  courseSubmittingFailure,
  courseSubmittingSuccess,
} from './courseSubmitInfo';
import * as types from '../constants/courseSubmitInfo';


describe('courseSubmittingInfo actions', () => {
  const targetRun = {
    key: 'edX101+DemoX',
  };

  it('handles submitting from the course page without a target run', () => {
    const expectedAction = {
      type: types.COURSE_SUBMITTING_INFO,
      targetRun: null,
    };

    expect(courseSubmittingInfo()).toEqual(expectedAction);
  });

  it('handles submitting from the course page with a target run', () => {
    const expectedAction = {
      type: types.COURSE_SUBMITTING_INFO,
      targetRun,
    };

    expect(courseSubmittingInfo(targetRun)).toEqual(expectedAction);
  });

  it('handles Cancel submit', () => {
    const expectedAction = {
      type: types.COURSE_SUBMITTING_CANCEL,
    };

    expect(courseSubmittingCancel()).toEqual(expectedAction);
  });

  it('handles Failure submit', () => {
    const errors = {
      field: 'value',
      field2: 'value2',
    };
    const expectedAction = {
      type: types.COURSE_SUBMITTING_FAILURE,
      errors,
    };

    expect(courseSubmittingFailure(errors)).toEqual(expectedAction);
  });

  it('handles Success submit', () => {
    const expectedAction = {
      type: types.COURSE_SUBMITTING_SUCCESS,
    };

    expect(courseSubmittingSuccess()).toEqual(expectedAction);
  });
});
