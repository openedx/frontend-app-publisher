import {
  REQUEST_COURSE_RUN_OPTIONS_FAIL,
  REQUEST_COURSE_RUN_OPTIONS_SUCCESS,
  REQUEST_COURSE_RUN_OPTIONS,
} from '../constants/courseRunOptions';

const initialState = {
  data: {},
  isFetching: false,
  error: null,
};

function courseRunOptions(state = initialState, action) {
  switch (action.type) {
    case REQUEST_COURSE_RUN_OPTIONS_FAIL:
      return {
        ...state,
        data: {},
        isFetching: false,
        error: action.error,
      };
    case REQUEST_COURSE_RUN_OPTIONS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetching: false,
        error: null,
      };
    case REQUEST_COURSE_RUN_OPTIONS:
      return {
        ...state,
        data: {},
        isFetching: true,
        error: null,
      };
    default:
      return state;
  }
}

export default courseRunOptions;
