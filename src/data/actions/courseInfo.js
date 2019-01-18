import {
  FAIL_COURSE_INFO,
  RECEIVE_COURSE_INFO,
  REQUEST_COURSE_INFO,
  UUID_REGEX,
  CREATE_COURSE,
  CREATE_COURSE_SUCCESS,
  CREATE_COURSE_FAIL,
} from '../constants/courseInfo';


import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

export function failCourseInfo(id, error) {
  return { type: FAIL_COURSE_INFO, id, error };
}

export function receiveCourseInfo(id, data) {
  return { type: RECEIVE_COURSE_INFO, id, data };
}

export function requestCourseInfo(id) {
  return { type: REQUEST_COURSE_INFO, id };
}

export function createNewCourse(courseData) {
  return {
    type: CREATE_COURSE, courseData,
  };
}

export function courseCreateSuccess(data) {
  return { type: CREATE_COURSE_SUCCESS, data };
}

export function courseCreateFail(error) {
  return { type: CREATE_COURSE_FAIL, error };
}

export function fetchCourseInfo(id) {
  return (dispatch) => {
    // We only support UUIDs right now, not course keys
    if (!UUID_REGEX.test(id)) {
      const error = `Could not get course information. ${id} is not a valid course UUID.`;
      dispatch(failCourseInfo(id, error));
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

        dispatch(receiveCourseInfo(id, course));
      })
      .catch((error) => {
        dispatch(failCourseInfo(
          id,
          `Could not get course information. ${error.toString()}`,
        ));
      });
  };
}

export function createCourse(courseData) {
  return (dispatch) => {
    dispatch(createNewCourse(courseData));
    // Send create course POST
    return DiscoveryDataApiService.createCourse(courseData)
      .then((response) => {
        const course = response.data;
        dispatch(courseCreateSuccess(course));
      })
      .catch((error) => {
        dispatch(courseCreateFail(`Course create failed, please try again or contact support. Error( ${error.response.data} )`));
      });
  };
}
