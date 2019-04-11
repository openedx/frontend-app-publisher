import FROM_EDIT_COURSE from '../constants/fromEditCourse';

export default function fromEditCourse(courseUuid) {
  return { type: FROM_EDIT_COURSE, fromEditCourse: true, courseUuid };
}
