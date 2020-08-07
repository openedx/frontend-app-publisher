import courseSubmitInfoReducer from './courseSubmitInfo';
import { courseRunSubmitting, courseSubmitRun, courseSubmittingFailure } from '../actions/courseSubmitInfo';

describe('courseSubmitRun reducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      errors: null,
      targetRun: null,
      isSubmittingRunReview: false,
    };
  });

  it('initial state is valid', () => {
    expect(courseSubmitInfoReducer(undefined, {})).toEqual({
      errors: null,
      targetRun: null,
      isSubmittingRunReview: false,
      showReviewStatusAlert: false,
    });
  });

  it('courseRunSubmitting action sets isSubmittingRunReview boolean', () => {
    expect(courseSubmitInfoReducer(initialState, courseRunSubmitting()))
      .toEqual({
        errors: null,
        targetRun: null,
        isSubmittingRunReview: true,
      });
  });

  it('courseSubmitRun action works with targetRun', () => {
    const targetRun = {
      key: 'edX101+DemoX',
    };

    expect(courseSubmitInfoReducer(initialState, courseSubmitRun(targetRun)))
      .toEqual({
        errors: null,
        targetRun,
        isSubmittingRunReview: false,
      });
  });

  it('courseSubmitRun action works without targetRun', () => {
    const targetRun = null;

    expect(courseSubmitInfoReducer(initialState, courseSubmitRun(targetRun)))
      .toEqual({
        errors: null,
        targetRun,
        isSubmittingRunReview: false,
      });
  });

  it('courseSubmittingFailure sets error state', () => {
    const prevState = { isSubmittingRunReview: true };
    const errors = { one: 'value' };
    expect(courseSubmitInfoReducer(prevState, courseSubmittingFailure(errors)))
      .toEqual({
        errors,
        isSubmittingRunReview: false,
      });
  });
});
