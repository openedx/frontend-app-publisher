import {
  CREATE_COMMENT,
  CREATE_COMMENT_FAIL,
  CREATE_COMMENT_SUCCESS,
  REQUEST_COMMENTS,
  REQUEST_COMMENTS_FAIL,
  REQUEST_COMMENTS_SUCCESS,
} from '../constants/comments';


const initialState = {
  data: {},
  isFetching: false,
  isCreating: false,
  error: null,
};

function comments(state = initialState, action) {
  switch (action.type) {
    case CREATE_COMMENT:
      return Object.assign({}, state, {
        isCreating: true,
        error: action.error,
      });
    case CREATE_COMMENT_FAIL:
      return Object.assign({}, state, {
        isCreating: false,
        error: action.error,
      });
    case CREATE_COMMENT_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isCreating: false,
        error: null,
      });
    case REQUEST_COMMENTS:
      return Object.assign({}, state, {
        data: {},
        isFetching: true,
        error: null,
      });
    case REQUEST_COMMENTS_FAIL:
      return Object.assign({}, state, {
        data: {},
        isFetching: false,
        error: action.error,
      });
    case REQUEST_COMMENTS_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isFetching: false,
        error: null,
      });
    default:
      return state;
  }
}

export default comments;
