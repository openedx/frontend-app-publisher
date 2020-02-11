import {
  ADD_COURSE_EDITOR_SUCCESS,
  REMOVE_COURSE_EDITOR_SUCCESS,
  REQUEST_COURSE_EDITORS,
  REQUEST_COURSE_EDITORS_FAIL,
  REQUEST_COURSE_EDITORS_SUCCESS,
} from '../constants/courseEditors';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

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

    DiscoveryDataApiService.fetchCourseEditors(id).subscribe(
      editors => dispatch(requestCourseEditorsSuccess(editors)),
      error => dispatch(requestCourseEditorsFail(error)),
    );
  };
}

function addCourseEditor(courseId, userId) {
  return (dispatch) => {
    dispatch(requestCourseEditors());

    DiscoveryDataApiService.addCourseEditor({
      course: courseId,
      user_id: userId,
    }).subscribe(
      editor => dispatch(addCourseEditorSuccess(editor)),
      error => requestCourseEditorsFail(error)
    );
  };
}

function removeCourseEditor(editorId) {
  return (dispatch) => {
    dispatch(requestCourseEditors());

    return DiscoveryDataApiService.removeCourseEditor(editorId).subscribe(
      () => dispatch(removeCourseEditorSuccess(editorId)),
      error => dispatch(requestCourseEditorsFail(error)),
    );
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
