import {
  REQUEST_COURSE_TAG_OPTIONS,
  REQUEST_COURSE_TAG_OPTIONS_FAIL,
  REQUEST_COURSE_TAG_OPTIONS_SUCCESS,
} from '../constants/couseTagOptions';

const initialState = {
  data: {},
  isFetching: false,
};

function CourseTagOptions(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_COURSE_TAG_OPTIONS:
      return {
        ...state,
        isFetching: false,
      };
    case REQUEST_COURSE_TAG_OPTIONS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetching: false,
      };
    case REQUEST_COURSE_TAG_OPTIONS_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
}

export default CourseTagOptions;
