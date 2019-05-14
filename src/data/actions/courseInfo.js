import { push } from 'connected-react-router';

import { getErrorMessages } from '../../utils';

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
import { courseSubmittingFailure, courseSubmittingSuccess } from './courseSubmitInfo';

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
      const error = [`Could not get course information. ${id} is not a valid course UUID.`];
      dispatch(requestCourseInfoFail(id, error));
      return Promise.resolve(); // early exit with empty promise
    }

    dispatch(requestCourseInfo(id));

    return DiscoveryDataApiService.fetchCourse(id)
      .then((response) => {
        const course = response.data;
        dispatch(requestCourseInfoSuccess(id, course));
      })
      .catch((error) => {
        dispatch(requestCourseInfoFail(
          id,
          ['Could not get course information.'].concat(getErrorMessages(error)),
        ));
      });
  };
}

function createCourseRun(courseUuid, courseRunData) {
  return (dispatch) => {
    dispatch(createNewCourseRun(courseRunData));
    if (!courseRunData.course) {
      dispatch(createCourseRunFail(['Course Run create failed, please try again or contact support. Course create incomplete.']));
      return null;
    }

    return DiscoveryDataApiService.createCourseRun(courseRunData)
      .then((response) => {
        const courseRun = response.data;
        dispatch(createCourseRunSuccess(courseRun));
        return dispatch(push(`/courses/${courseUuid}`));
      })
      .catch((error) => {
        dispatch(createCourseRunFail(['Course Run create failed, please try again or contact support.'].concat(getErrorMessages(error))));
      });
  };
}

function createCourse(courseData) {
  return (dispatch) => {
    dispatch(createNewCourse(courseData));
    dispatch(createNewCourseRun(courseData.course_run));

    return DiscoveryDataApiService.createCourse(courseData)
      .then((response) => {
        const course = response.data;
        dispatch(createCourseSuccess(course));
        const courseRun = course.course_runs[0];
        dispatch(createCourseRunSuccess(courseRun));
        return dispatch(push(`/courses/${course.uuid}`));
      })
      .catch((error) => {
        dispatch(createCourseFail(['Creation failed, please try again or contact support.'].concat(getErrorMessages(error))));
      });
  };
}

function editCourse(courseData, courseRunData, submittingRunForReview = false) {
  const submitReview = submittingRunForReview;
  return (dispatch) => {
    dispatch(editCourseInfo(courseData));
    // Send edit course PATCH
    return DiscoveryDataApiService.editCourse(courseData, courseRunData)
      .then((response) => {
        const course = response.pop().data;
        course.course_runs = response.map(courseRun => courseRun.data);
        dispatch(editCourseSuccess(course));
        if (submitReview) {
          dispatch(courseSubmittingSuccess());
        }
      })
      .catch((error) => {
        dispatch(editCourseFail(['Course edit failed, please try again or contact support.'].concat(getErrorMessages(error))));
        if (submitReview) {
          dispatch(courseSubmittingFailure());
        }
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
