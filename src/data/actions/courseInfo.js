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
  CREATE_COURSE_CANCEL,
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

function createCourseCancel() {
  return { type: CREATE_COURSE_CANCEL };
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

function clearCreateCourseStatus() {
  return (dispatch) => {
    dispatch(createCourseCancel());
  };
}

function updateFormValuesAfterSave(change, currentFormValues, initialValues) {
  /*
    We need to overwrite imageSrc and course run statuses because they are changed
    in the backend so the form does not have the updated values by default.
    * This will allow the form to return to being pristine after saving. *
  */
  return (dispatch) => {
    const {
      imageSrc: initialImageSrc,
      course_runs: initialCourseRuns,
    } = initialValues;
    // This emits a redux action called CHANGE that will update currentFormValues.imageSrc
    change('imageSrc', initialImageSrc);
    for (let i = 0; i < initialCourseRuns.length; i += 1) {
      change(`course_runs[${i}].status`, initialCourseRuns[i].status);
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
        let errorList;
        if (!error.response || error.response.status === 504) {
          // See DISCO-1548. Basically, a course is so large that nginx kills requests before Studio
          // can finish copying content. So we add a custom message about this case.
          // In prod/stage, we see an 'undefined' response (axios eating it?) but the server does
          // return a 504 for this case. So handle both response values.
          errorList = ['Due to the quantity of content in this course, we anticipate a longer wait time for the creation of a new course run in Publisher. The run is now available in Studio in the meantime. Please check back in a business day or contact your Project Coordinator for help.'];
        } else {
          errorList = ['Course Run create failed, please try again or contact support.'].concat(getErrorMessages(error));
        }
        dispatch(createCourseRunFail(errorList));
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

function handleCourseRuns(
  dispatch,
  courseRunData,
  course,
  submitReview,
  internalReview,
  refreshData,
) {
  // make course copy so we are not re-assigning properties of this functions original params
  const newCourse = { ...course };
  let sendData = DiscoveryDataApiService.editCourseRuns;
  if (internalReview) {
    sendData = data => Promise.all([DiscoveryDataApiService.internalReviewEdit(data)]);
  }
  sendData(courseRunData).then((runResponse) => {
    // replace any runs that changed here because we updated the runs via API
    runResponse.forEach((response) => {
      const i = newCourse.course_runs.findIndex(run => run.key === response.data.key);
      newCourse.course_runs[i] = response.data;
    });
    dispatch(editCourseSuccess(newCourse));
    if (submitReview) {
      dispatch(courseSubmittingSuccess());
    }
    if (internalReview) {
      refreshData();
    }
  }).catch((error) => {
    dispatch(editCourseFail(['Course Run edit failed, please try again or contact support.']
      .concat(getErrorMessages(error))));
    if (submitReview) { dispatch(courseSubmittingFailure()); }
  });
}

function editCourse(
  courseData,
  courseRunData,
  submittingRunForReview,
  isInternalReview,
  refreshData,
) {
  return (dispatch) => {
    dispatch(editCourseInfo(courseData));
    // Send edit course PATCH
    return DiscoveryDataApiService.editCourse(courseData)
      .then((response) => {
        const course = response.data;
        handleCourseRuns(
          dispatch,
          courseRunData,
          course,
          submittingRunForReview,
          isInternalReview,
          refreshData,
        );
      })
      .catch((error) => {
        dispatch(editCourseFail(['Course edit failed, please try again or contact support.'].concat(getErrorMessages(error))));
        if (submittingRunForReview) {
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
  clearCreateCourseStatus,
  createNewCourse,
  createCourseCancel,
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
