import {
  ADD_COURSE_EDITOR_SUCCESS,
  REMOVE_COURSE_EDITOR_SUCCESS,
  REQUEST_COURSE_EDITORS,
  REQUEST_COURSE_EDITORS_FAIL,
  REQUEST_COURSE_EDITORS_SUCCESS,
} from '../constants/courseEditors';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

import { getErrorMessages } from '../../utils';

function addCourseEditorSuccess(data) {
  return { type: ADD_COURSE_EDITOR_SUCCESS, data };
}

function removeCourseEditorSuccess(editorId) {
  return { type: REMOVE_COURSE_EDITOR_SUCCESS, editorId };
}

function requestCourseEditors() {
  return { type: REQUEST_COURSE_EDITORS };
}

function requestCourseEditorsFail(error) {
  return { type: REQUEST_COURSE_EDITORS_FAIL, error };
}

function requestCourseEditorsSuccess(data) {
  return { type: REQUEST_COURSE_EDITORS_SUCCESS, data };
}

function fetchCourseEditors(id) {
  return (dispatch) => {
    dispatch(requestCourseEditors());

    return DiscoveryDataApiService.fetchCourseEditors(id)
      .then((response) => {
        const editors = response.data.results;
        dispatch(requestCourseEditorsSuccess(editors));
      })
      .catch((error) => {
        const msg = ['Could not get course editors.'].concat(getErrorMessages(error));
        dispatch(requestCourseEditorsFail(msg));
      });
  };
}

function addCourseEditor(courseId, userId) {
  return (dispatch) => {
    dispatch(requestCourseEditors());

    return DiscoveryDataApiService.addCourseEditor({
      course: courseId,
      user_id: userId,
    })
      .then((response) => {
        dispatch(addCourseEditorSuccess(response.data));
      })
      .catch((error) => {
        const msg = ['Could not add course editor.'].concat(getErrorMessages(error));
        dispatch(requestCourseEditorsFail(msg));
      });
  };
}

function removeCourseEditor(editorId) {
  return (dispatch) => {
    dispatch(requestCourseEditors());

    return DiscoveryDataApiService.removeCourseEditor(editorId)
      .then(() => {
        dispatch(removeCourseEditorSuccess(editorId));
      })
      .catch((error) => {
        const msg = ['Could not remove course editor.'].concat(getErrorMessages(error));
        dispatch(requestCourseEditorsFail(msg));
      });
  };
}

export {
  addCourseEditor,
  addCourseEditorSuccess,
  fetchCourseEditors,
  removeCourseEditor,
  removeCourseEditorSuccess,
  requestCourseEditors,
  requestCourseEditorsFail,
  requestCourseEditorsSuccess,
};
