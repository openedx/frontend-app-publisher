import { push } from 'connected-react-router';

import { getErrorMessages } from '../../utils';

import {
  REQUEST_COURSE_INFO_FAIL,
  REQUEST_COURSE_INFO_SUCCESS,
  REQUEST_COURSE_INFO,
  EDIT_COURSE_INFO,
  EDIT_COURSE_SUCCESS,
  EDIT_COURSE_FAIL,
  CLEAR_COURSE_SAVED,
  UUID_REGEX,
  CLEAR_COURSE_INFO_ERRORS,
  CREATE_COURSE,
  CREATE_COURSE_SUCCESS,
  CREATE_COURSE_FAIL,
  CREATE_COURSE_RUN,
  CREATE_COURSE_RUN_SUCCESS,
  CREATE_COURSE_RUN_FAIL,
  CLEAR_COURSE_RUN_ALERT,
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

function clearCourseInfoErrors() {
  // We do not want to accidentally persist an error from a different page
  // when a user comes to a create page.
  return { type: CLEAR_COURSE_INFO_ERRORS };
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

function clearCourseSaved() {
  return { type: CLEAR_COURSE_SAVED };
}

function updateFormValuesAfterSave(change, currentFormValues, initialImageSrc, initialCourseRuns) {
  /*
    We need to overwrite imageSrc and course run statuses because they are changed
    in the backend so the form does not have the updated values by default.
    * This will allow the form to return to being pristine after saving. *
  */
  return (dispatch) => {
    // This emits a redux action called CHANGE that will update currentFormValues.imageSrc
    change('imageSrc', initialImageSrc);
    for (let i = 0; i < initialCourseRuns.length; i += 1) {
      // Status is modified directly because it is not a registeredField with the form, but
      // is still used in comparison for deciding if the form is pristine.
      // eslint-disable-next-line no-param-reassign
      currentFormValues.course_runs[i].status = initialCourseRuns[i].status;
    }
    // Need to reset courseInfo.courseSaved to false so we don't continuously
    // overwrite the currentFormValues.
    dispatch(clearCourseSaved());
  };
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
    return DiscoveryDataApiService.editCourse(courseData)
      .then((response) => {
        const course = response.data;
        DiscoveryDataApiService.editCourseRuns(courseRunData).then((runResponse) => {
          course.course_runs = runResponse.map(courseRun => courseRun.data);
          dispatch(editCourseSuccess(course));
          if (submitReview) {
            dispatch(courseSubmittingSuccess());
          }
        }).catch((error) => {
          dispatch(editCourseFail(['Course Run edit failed, please try again or contact support.'].concat(getErrorMessages(error))));
          if (submitReview) {
            dispatch(courseSubmittingFailure());
          }
        });
      })
      .catch((error) => {
        dispatch(editCourseFail(['Course edit failed, please try again or contact support.'].concat(getErrorMessages(error))));
        if (submitReview) {
          dispatch(courseSubmittingFailure());
        }
      });
  };
}

function setCreateAlertOff() {
  return { type: CLEAR_COURSE_RUN_ALERT };
}

function clearCreateStatusAlert() {
  return (dispatch) => {
    dispatch(setCreateAlertOff());
  };
}

export {
  requestCourseInfoFail,
  requestCourseInfoSuccess,
  requestCourseInfo,
  clearCourseInfoErrors,
  clearCreateStatusAlert,
  createNewCourse,
  createCourseSuccess,
  createCourseFail,
  createNewCourseRun,
  createCourseRunSuccess,
  createCourseRunFail,
  editCourseInfo,
  editCourseSuccess,
  editCourseFail,
  clearCourseSaved,
  fetchCourseInfo,
  createCourseRun,
  createCourse,
  editCourse,
  updateFormValuesAfterSave,
  setCreateAlertOff,
};
