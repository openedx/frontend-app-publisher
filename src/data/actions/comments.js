import { getErrorMessages } from '../../utils';

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

    return DiscoveryDataApiService.createComment(commentData)
      .then((response) => {
        dispatch(createCommentSuccess(response.data));
      })
      .catch((error) => {
        dispatch(createCommentFail(['Comment create failed, please try again or contact support.'].concat(getErrorMessages(error))));
      });
  };
}

function fetchComments(id) {
  return (dispatch) => {
    // We only support UUIDs right now, not course keys
    if (!UUID_REGEX.test(id)) {
      const error = [`Could not get course comments. ${id} is not a valid course UUID.`];
      dispatch(requestCommentsFail(id, error));
      return Promise.resolve(); // early exit with empty promise
    }

    dispatch(requestComments(id));

    return DiscoveryDataApiService.fetchComments(id)
      .then((response) => {
        const comments = response.data;
        dispatch(requestCommentsSuccess(id, comments));
      })
      .catch((error) => {
        dispatch(requestCommentsFail(
          id,
          ['Could not get course comments.'].concat(getErrorMessages(error)),
        ));
      });
  };
}

export {
  addComment,
  fetchComments,
  requestCommentsFail,
  requestCommentsSuccess,
  requestComments,
};
