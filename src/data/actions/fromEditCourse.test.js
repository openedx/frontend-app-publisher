import fromEditCourse from './fromEditCourse';
import FROM_EDIT_COURSE from '../constants/fromEditCourse';


describe('fromEditCourse actions', () => {
  const courseUuid = '00000000-0000-0000-0000-000000000000';

  it('should handle sending from the edit course page', () => {
    const expectedAction = {
      type: FROM_EDIT_COURSE,
      fromEditCourse: true,
      courseUuid,
    };

    expect(fromEditCourse(courseUuid)).toEqual(expectedAction);
  });
});
