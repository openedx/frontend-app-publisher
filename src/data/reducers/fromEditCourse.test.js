import fromEditCourse from './fromEditCourse';
import fromEditCourseAction from '../actions/fromEditCourse';


describe('fromEditCourse reducer', () => {
  let initalState;

  beforeEach(() => {
    initalState = {
      fromEditCourse: false,
      courseUuid: null,
    };
  });

  it('initial state is valid', () => {
    expect(fromEditCourse(undefined, {})).toEqual({
      fromEditCourse: false,
      courseUuid: null,
    });
  });

  it('from edit course action works', () => {
    const courseUuid = '00000000-0000-0000-0000-000000000000';
    expect(fromEditCourse(initalState, fromEditCourseAction(courseUuid)))
      .toEqual({
        fromEditCourse: true,
        courseUuid,
      });
  });
});
