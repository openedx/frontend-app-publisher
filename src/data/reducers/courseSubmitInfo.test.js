import courseSubmitInfoReducer from './courseSubmitInfo';
import { courseSubmittingInfo } from '../actions/courseSubmitInfo';


describe('courseSubmittingInfo reducer', () => {
  let initalState;

  beforeEach(() => {
    initalState = {
      targetRun: null,
      isSubmittingRunReview: false,
    };
  });

  it('initial state is valid', () => {
    expect(courseSubmitInfoReducer(undefined, {})).toEqual({
      targetRun: null,
      isSubmittingRunReview: false,
    });
  });

  it('courseSubmittingInfo action works with targetRun', () => {
    const targetRun = {
      key: 'edX101+DemoX',
    };

    expect(courseSubmitInfoReducer(initalState, courseSubmittingInfo(targetRun)))
      .toEqual({
        targetRun,
        isSubmittingRunReview: true,
      });
  });

  it('courseSubmittingInfo action works without targetRun', () => {
    const targetRun = null;

    expect(courseSubmitInfoReducer(initalState, courseSubmittingInfo(targetRun)))
      .toEqual({
        targetRun,
        isSubmittingRunReview: false,
      });
  });
});
