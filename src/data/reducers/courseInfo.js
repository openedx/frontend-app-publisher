import {
  REQUEST_COURSE_INFO,
  REQUEST_COURSE_INFO_SUCCESS,
  REQUEST_COURSE_INFO_FAIL,
  CLEAR_COURSE_INFO_ERRORS,
  CREATE_COURSE,
  CREATE_COURSE_SUCCESS,
  CREATE_COURSE_FAIL,
  CREATE_COURSE_RUN,
  CREATE_COURSE_RUN_SUCCESS,
  CREATE_COURSE_RUN_FAIL,
  EDIT_COURSE_INFO,
  EDIT_COURSE_SUCCESS,
  EDIT_COURSE_FAIL,
  CLEAR_COURSE_SAVED,
} from '../constants/courseInfo';


const initialState = {
  data: {},
  isFetching: false,
  isCreating: false,
  isSubmittingEdit: false,
  error: null,
  courseSaved: false,
};

function courseInfo(state = initialState, action) {
  switch (action.type) {
    case REQUEST_COURSE_INFO_FAIL:
      return Object.assign({}, state, {
        data: {},
        isFetching: false,
        error: action.error,
      });
    case REQUEST_COURSE_INFO_SUCCESS:
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
    case CLEAR_COURSE_INFO_ERRORS:
      return Object.assign({}, state, {
        error: null,
      });
    case CREATE_COURSE:
      return Object.assign({}, state, {
        isCreating: true,
        error: null,
      });
    case CREATE_COURSE_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        error: null,
      });
    case CREATE_COURSE_FAIL:
      return Object.assign({}, state, {
        isCreating: false,
        error: action.error,
      });
    case CREATE_COURSE_RUN:
      return Object.assign({}, state, {
        isCreating: true,
        error: null,
      });
    case CREATE_COURSE_RUN_SUCCESS:
      return Object.assign({}, state, {
        isCreating: false,
        error: null,
      });
    case CREATE_COURSE_RUN_FAIL:
      return Object.assign({}, state, {
        isCreating: false,
        error: action.error,
      });
    case EDIT_COURSE_INFO:
      return Object.assign({}, state, {
        isSubmittingEdit: true,
        error: null,
      });
    case EDIT_COURSE_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isSubmittingEdit: false,
        error: null,
        courseSaved: true,
      });
    case EDIT_COURSE_FAIL:
      return Object.assign({}, state, {
        isSubmittingEdit: false,
        error: action.error,
      });
    case CLEAR_COURSE_SAVED:
      return Object.assign({}, state, {
        courseSaved: false,
      });
    default:
      return state;
  }
}

export default courseInfo;
