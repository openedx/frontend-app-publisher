import courseSubmitInfo from './courseSubmitInfo';
import COURSE_SUBMIT_INFO from '../constants/courseSubmitInfo';


describe('courseSubmittingInfo actions', () => {
  const targetRun = {
    key: 'edX101+DemoX',
  };

  it('handles submitting from the course page without a target run', () => {
    const expectedAction = {
      type: COURSE_SUBMIT_INFO,
      targetRun: null,
    };

    expect(courseSubmitInfo()).toEqual(expectedAction);
  });

  it('handles submitting from the course page with a target run', () => {
    const expectedAction = {
      type: COURSE_SUBMIT_INFO,
      targetRun,
    };

    expect(courseSubmitInfo(targetRun)).toEqual(expectedAction);
  });
});
