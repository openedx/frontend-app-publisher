import {
  REQUEST_INSTRUCTOR_OPTIONS_FAIL,
  REQUEST_INSTRUCTOR_OPTIONS_SUCCESS,
  REQUEST_INSTRUCTOR_OPTIONS,
} from '../constants/instructorOptions';


const initialState = {
  data: {},
  isFetching: false,
  error: null,
};

function instructorOptions(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INSTRUCTOR_OPTIONS_FAIL:
      return Object.assign({}, state, {
        data: {},
        isFetching: false,
        error: action.error,
      });
    case REQUEST_INSTRUCTOR_OPTIONS_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isFetching: false,
        error: null,
      });
    case REQUEST_INSTRUCTOR_OPTIONS:
      return Object.assign({}, state, {
        data: {},
        isFetching: true,
        error: null,
      });
    default:
      return state;
  }
}

export default instructorOptions;
