import sourceInfo from './sourceInfo';
import SEND_FROM_EDIT_PAGE from '../constants/sourceInfo';

describe('sourceInfo actions', () => {
  const courseUuid = '00000000-0000-0000-0000-000000000000';
  const referrer = `/courses/${courseUuid}/edit`;

  it('should handle sending from the edit course page without a referring run', () => {
    const expectedAction = {
      type: SEND_FROM_EDIT_PAGE,
      referrer,
      referringRun: null,
    };

    expect(sourceInfo(referrer)).toEqual(expectedAction);
  });

  it('should handle sending from the edit course page with a referring run', () => {
    const referringRun = 'DemoX+TestCourse';
    const expectedAction = {
      type: SEND_FROM_EDIT_PAGE,
      referrer,
      referringRun,
    };

    expect(sourceInfo(referrer, referringRun)).toEqual(expectedAction);
  });
});
