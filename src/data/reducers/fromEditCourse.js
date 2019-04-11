import FROM_EDIT_COURSE from '../constants/fromEditCourse';


const initialState = {
  fromEditCourse: false,
  courseUuid: null,
};

function fromEditCourse(state = initialState, action) {
  switch (action.type) {
    case FROM_EDIT_COURSE:
      return Object.assign({}, state, {
        fromEditCourse: action.fromEditCourse,
        courseUuid: action.courseUuid,
      });
    default:
      return state;
  }
}

export default fromEditCourse;
