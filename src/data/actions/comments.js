import {
  CREATE_COMMENT,
  CREATE_COMMENT_FAIL,
  CREATE_COMMENT_SUCCESS,
  REQUEST_COMMENTS,
  REQUEST_COMMENTS_FAIL,
  REQUEST_COMMENTS_SUCCESS,
} from '../constants/comments';
import { UUID_REGEX } from '../constants/courseInfo';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

function createCommentFail(error) {
  return { type: CREATE_COMMENT_FAIL, error };
}

function createCommentSuccess(data) {
  return { type: CREATE_COMMENT_SUCCESS, data };
}

function createNewComment(data) {
  return { type: CREATE_COMMENT, data };
}

function requestComments(id) {
  return { type: REQUEST_COMMENTS, id };
}

function requestCommentsFail(id, error) {
  return { type: REQUEST_COMMENTS_FAIL, id, error };
}

function requestCommentsSuccess(id, data) {
  return { type: REQUEST_COMMENTS_SUCCESS, id, data };
}

function addComment(commentData) {
  return (dispatch) => {
    dispatch(createNewComment(commentData));
    DiscoveryDataApiService.createComment(commentData).subscribe(
      comment => dispatch(createCommentSuccess(comment)),
      error => dispatch(createCommentFail(error)),
    );
  };
}

function fetchComments(id) {
  return (dispatch) => {
    // We only support UUIDs right now, not course keys
    if (!UUID_REGEX.test(id)) {
      const error = [`Could not get course comments. ${id} is not a valid course UUID.`];
      dispatch(requestCommentsFail(id, error));
    } else {
      dispatch(requestComments(id));
      DiscoveryDataApiService.fetchComments(id).subscribe(
        comments => dispatch(requestCommentsSuccess(id, comments)),
        error => dispatch(requestCommentsFail(id, error)),
      );
    }
  };
}

export {
  addComment,
  fetchComments,
  requestCommentsFail,
  requestCommentsSuccess,
  requestComments,
};
