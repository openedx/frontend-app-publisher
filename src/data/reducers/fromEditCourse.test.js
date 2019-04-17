import fromEditCourse from './fromEditCourse';
import fromEditCourseAction from '../actions/fromEditCourse';


describe('fromEditCourse reducer', () => {
  let initalState;

  beforeEach(() => {
    initalState = {
      referrer: null,
    };
  });

  it('initial state is valid', () => {
    expect(fromEditCourse(undefined, {})).toEqual({ referrer: null });
  });

  it('from edit course action works', () => {
    const courseUuid = '00000000-0000-0000-0000-000000000000';
    const referrer = `courses/${courseUuid}/edit`;

    expect(fromEditCourse(initalState, fromEditCourseAction(referrer))).toEqual({ referrer });
  });
});
