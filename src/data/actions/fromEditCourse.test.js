import fromEditCourse from './fromEditCourse';
import FROM_EDIT_COURSE from '../constants/fromEditCourse';


describe('fromEditCourse actions', () => {
  const courseUuid = '00000000-0000-0000-0000-000000000000';
  const referrer = `/courses/${courseUuid}/edit`;

  it('should handle sending from the edit course page', () => {
    const expectedAction = {
      type: FROM_EDIT_COURSE,
      referrer,
    };

    expect(fromEditCourse(referrer)).toEqual(expectedAction);
  });
});
