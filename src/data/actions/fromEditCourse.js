import FROM_EDIT_COURSE from '../constants/fromEditCourse';

export default function fromEditCourse(referrer) {
  return { type: FROM_EDIT_COURSE, referrer };
}
