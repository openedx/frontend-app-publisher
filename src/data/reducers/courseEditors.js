import {
  ADD_COURSE_EDITOR_SUCCESS,
  REMOVE_COURSE_EDITOR_SUCCESS,
  REQUEST_COURSE_EDITORS,
  REQUEST_COURSE_EDITORS_FAIL,
  REQUEST_COURSE_EDITORS_SUCCESS,
} from '../constants/courseEditors';

const initialState = {
  data: [],
  error: null,
  isFetching: false,
};

function courseEditors(state = initialState, action) {
  switch (action.type) {
    case ADD_COURSE_EDITOR_SUCCESS:
      return {
        ...state,
        data: state.data.concat(action.data),
        error: null,
        isFetching: false,
      };
    case REMOVE_COURSE_EDITOR_SUCCESS:
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.editorId),
        error: null,
        isFetching: false,
      };
    case REQUEST_COURSE_EDITORS:
      return { ...state, isFetching: true };
    case REQUEST_COURSE_EDITORS_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    case REQUEST_COURSE_EDITORS_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
        isFetching: false,
      };
    default:
      return state;
  }
}

export default courseEditors;
