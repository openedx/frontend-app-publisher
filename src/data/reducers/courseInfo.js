import {
  FAIL_COURSE_INFO,
  RECEIVE_COURSE_INFO,
  REQUEST_COURSE_INFO,
  CREATE_COURSE,
  CREATE_COURSE_SUCCESS,
  CREATE_COURSE_FAIL,
} from '../constants/courseInfo';


const initialState = {
  data: {},
  isFetching: false,
  error: null,
};

function courseInfo(state = initialState, action) {
  switch (action.type) {
    case FAIL_COURSE_INFO:
      return Object.assign({}, state, {
        data: {},
        isFetching: false,
        error: action.error,
      });
    case RECEIVE_COURSE_INFO:
      return Object.assign({}, state, {
        data: action.data,
        isFetching: false,
        error: null,
      });
    case REQUEST_COURSE_INFO:
      return Object.assign({}, state, {
        data: {},
        isFetching: true,
        error: null,
      });
    case CREATE_COURSE:
      return Object.assign({}, state, {
        data: {},
        error: null,
      });
    case CREATE_COURSE_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        error: null,
      });
    case CREATE_COURSE_FAIL:
      return Object.assign({}, state, {
        data: {},
        error: action.error,
      });
    default:
      return state;
  }
}

export default courseInfo;
