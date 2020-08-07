import {
  courseSubmitRun,
  courseRunSubmitting,
  courseSubmittingCancel,
  courseSubmittingFailure,
  courseSubmittingSuccess,
  courseSubmittingInReview,
} from './courseSubmitInfo';
import * as types from '../constants/courseSubmitInfo';

describe('courseSubmitInfo actions', () => {
  const targetRun = {
    key: 'edX101+DemoX',
  };

  it('handles submitting from the course page without a target run', () => {
    const expectedAction = {
      type: types.COURSE_SUBMIT_RUN,
      targetRun: null,
    };

    expect(courseSubmitRun()).toEqual(expectedAction);
  });

  it('handles submitting from the course page with a target run', () => {
    const expectedAction = {
      type: types.COURSE_SUBMIT_RUN,
      targetRun,
    };

    expect(courseSubmitRun(targetRun)).toEqual(expectedAction);
  });

  it('handles submitting', () => {
    const expectedAction = {
      type: types.COURSE_RUN_SUBMITTING,
    };

    expect(courseRunSubmitting()).toEqual(expectedAction);
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

  it('handles in review after successful submit', () => {
    const expectedAction = {
      type: types.CLEAR_REVIEW_ALERT,
    };

    expect(courseSubmittingInReview()).toEqual(expectedAction);
  });
});
