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
      return Object.assign({}, state, {
        data: state.data.concat(action.data),
        error: null,
        isFetching: false,
      });
    case REMOVE_COURSE_EDITOR_SUCCESS:
      return Object.assign({}, state, {
        data: state.data.filter(item => item.id !== action.editorId),
        error: null,
        isFetching: false,
      });
    case REQUEST_COURSE_EDITORS:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case REQUEST_COURSE_EDITORS_FAIL:
      return Object.assign({}, state, {
        error: action.error,
        isFetching: false,
      });
    case REQUEST_COURSE_EDITORS_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        error: null,
        isFetching: false,
      });
    default:
      return state;
  }
}

export default courseEditors;
