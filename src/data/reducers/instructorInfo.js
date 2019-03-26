import {
  CREATE_INSTRUCTOR,
  CREATE_INSTRUCTOR_SUCCESS,
  CREATE_INSTRUCTOR_FAIL,
} from '../constants/instructorInfo';


const initialState = {
  data: {},
  isCreating: false,
  error: null,
};

function instructorInfo(state = initialState, action) {
  switch (action.type) {
    case CREATE_INSTRUCTOR:
      return Object.assign({}, state, {
        data: {},
        isCreating: true,
        error: null,
      });
    case CREATE_INSTRUCTOR_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isCreating: false,
        error: null,
      });
    case CREATE_INSTRUCTOR_FAIL:
      return Object.assign({}, state, {
        data: {},
        isCreating: false,
        error: action.error,
      });
    default:
      return state;
  }
}

export default instructorInfo;
