import courseSubmitInfoReducer from './courseSubmitInfo';
import { courseSubmittingInfo, courseSubmittingFailure } from '../actions/courseSubmitInfo';


describe('courseSubmittingInfo reducer', () => {
  let initalState;

  beforeEach(() => {
    initalState = {
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

  it('courseSubmittingInfo action works with targetRun', () => {
    const targetRun = {
      key: 'edX101+DemoX',
    };

    expect(courseSubmitInfoReducer(initalState, courseSubmittingInfo(targetRun)))
      .toEqual({
        errors: null,
        targetRun,
        isSubmittingRunReview: true,
      });
  });

  it('courseSubmittingInfo action works without targetRun', () => {
    const targetRun = null;

    expect(courseSubmitInfoReducer(initalState, courseSubmittingInfo(targetRun)))
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
