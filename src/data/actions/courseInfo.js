import { push } from 'connected-react-router';

import {
  REQUEST_COURSE_INFO_FAIL,
  REQUEST_COURSE_INFO_SUCCESS,
  REQUEST_COURSE_INFO,
  EDIT_COURSE_INFO,
  EDIT_COURSE_SUCCESS,
  EDIT_COURSE_FAIL,
  UUID_REGEX,
  CREATE_COURSE,
  CREATE_COURSE_SUCCESS,
  CREATE_COURSE_FAIL,
} from '../constants/courseInfo';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';


function requestCourseInfoFail(id, error) {
  return { type: REQUEST_COURSE_INFO_FAIL, id, error };
}

function requestCourseInfoSuccess(id, data) {
  return { type: REQUEST_COURSE_INFO_SUCCESS, id, data };
}

function requestCourseInfo(id) {
  return { type: REQUEST_COURSE_INFO, id };
}

function createNewCourse(courseData) {
  return { type: CREATE_COURSE, courseData };
}

function createCourseSuccess(data) {
  return { type: CREATE_COURSE_SUCCESS, data };
}

function createCourseFail(error) {
  return { type: CREATE_COURSE_FAIL, error };
}

function editCourseInfo(courseData) {
  return { type: EDIT_COURSE_INFO, courseData };
}

function editCourseSuccess(data) {
  return { type: EDIT_COURSE_SUCCESS, data };
}

function editCourseFail(error) {
  return { type: EDIT_COURSE_FAIL, error };
}

function fetchCourseInfo(id) {
  return (dispatch) => {
    // We only support UUIDs right now, not course keys
    if (!UUID_REGEX.test(id)) {
      const error = `Could not get course information. ${id} is not a valid course UUID.`;
      dispatch(requestCourseInfoFail(id, error));
      return Promise.resolve(); // early exit with empty promise
    }

    dispatch(requestCourseInfo(id));

    return DiscoveryDataApiService.fetchCourse(id)
      .then((response) => {
        const course = response.data;

        // Confirm it looks vaguely correct
        if (!course || !('key' in course)) {
          throw Error('Did not understand response.');
        }

        dispatch(requestCourseInfoSuccess(id, course));
      })
      .catch((error) => {
        dispatch(requestCourseInfoFail(
          id,
          `Could not get course information. ${error.toString()}`,
        ));
      });
  };
}

function createCourse(courseData) {
  return (dispatch) => {
    dispatch(createNewCourse(courseData));
    // Send create course POST
    return DiscoveryDataApiService.createCourse(courseData)
      .then((response) => {
        const course = response.data;
        dispatch(push(`/courses/${course.uuid}/edit/`));
        dispatch(createCourseSuccess(course));
      })
      .catch((error) => {
        dispatch(createCourseFail(`Course create failed, please try again or contact support. Error( ${error.response.data} )`));
      });
  };
}

function editCourse(courseData) {
  return (dispatch) => {
    dispatch(editCourseInfo(courseData));
    // Send edit course PATCH
    return DiscoveryDataApiService.editCourse(courseData)
      .then((response) => {
        const course = response.data;
        dispatch(editCourseSuccess(course));
      })
      .catch((error) => {
        dispatch(editCourseFail(`Course edit failed, please try again or contact support. Error( ${error.response.data} )`));
      });
  };
}

export {
  requestCourseInfoFail,
  requestCourseInfoSuccess,
  requestCourseInfo,
  createNewCourse,
  createCourseSuccess,
  createCourseFail,
  editCourseInfo,
  editCourseSuccess,
  editCourseFail,
  fetchCourseInfo,
  createCourse,
  editCourse,
};
