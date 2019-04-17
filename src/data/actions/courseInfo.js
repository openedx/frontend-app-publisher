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
  CREATE_COURSE_RUN,
  CREATE_COURSE_RUN_SUCCESS,
  CREATE_COURSE_RUN_FAIL,
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

function createNewCourse(data) {
  return { type: CREATE_COURSE, data };
}

function createCourseSuccess(data) {
  return { type: CREATE_COURSE_SUCCESS, data };
}

function createCourseFail(error) {
  return { type: CREATE_COURSE_FAIL, error };
}

function createNewCourseRun(data) {
  return { type: CREATE_COURSE_RUN, data };
}

function createCourseRunSuccess(data) {
  return { type: CREATE_COURSE_RUN_SUCCESS, data };
}

function createCourseRunFail(error) {
  return { type: CREATE_COURSE_RUN_FAIL, error };
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

function createCourseRun(course, courseRunData) {
  return (dispatch) => {
    dispatch(createNewCourseRun());
    if (!course.key) {
      dispatch(createCourseRunFail('Course Run create failed, please try again or contact support. Error( Course create incomplete )'));
      return null;
    }

    const data = {
      course: course.key,
      start: (new Date(courseRunData.start)).toISOString(),
      end: (new Date(courseRunData.end)).toISOString(),
    };
    return DiscoveryDataApiService.createCourseRun(data)
      .then((response) => {
        const courseRun = response.data;
        dispatch(createCourseRunSuccess(courseRun));
        return dispatch(push(`/courses/${course.uuid}/edit/`));
      })
      .catch((response) => {
        let errorMsg = `Course Run create failed, please try again or contact support. \nError ( ${response.message} )`;
        const errorData = response.response.data;
        if (errorData) {
          // More options in the error response
          errorMsg += '\n\n';

          Object.keys(errorData).forEach((errorKey) => {
            if (Object.prototype.hasOwnProperty.call(errorData, errorKey)) {
              errorMsg += `${errorKey}: ${errorData[errorKey]}`;
            }
          });
        }
        dispatch(createCourseRunFail(errorMsg));
      });
  };
}

function createCourse(courseData, courseRunData) {
  return (dispatch) => {
    dispatch(createNewCourse(courseData));

    return DiscoveryDataApiService.createCourse(courseData)
      .then((response) => {
        const course = response.data;
        dispatch(createCourseSuccess(course));
        dispatch(createCourseRun(course, courseRunData));
      })
      .catch((error) => {
        dispatch(createCourseFail(`Course create failed, please try again or contact support. Error( ${error.response.data} )`));
      });
  };
}

function editCourse(courseData, courseRunData) {
  return (dispatch) => {
    dispatch(editCourseInfo(courseData));
    // Send edit course PATCH
    return DiscoveryDataApiService.editCourse(courseData, courseRunData)
      .then((response) => {
        const course = response[response.length - 1].data;
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
  createNewCourseRun,
  createCourseRunSuccess,
  createCourseRunFail,
  editCourseInfo,
  editCourseSuccess,
  editCourseFail,
  fetchCourseInfo,
  createCourseRun,
  createCourse,
  editCourse,
};
