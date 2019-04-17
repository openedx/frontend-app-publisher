import FROM_EDIT_COURSE from '../constants/fromEditCourse';


const initialState = {
  referrer: null,
};

function fromEditCourse(state = initialState, action) {
  switch (action.type) {
    case FROM_EDIT_COURSE:
      return Object.assign({}, state, {
        referrer: action.referrer,
      });
    default:
      return state;
  }
}

export default fromEditCourse;
