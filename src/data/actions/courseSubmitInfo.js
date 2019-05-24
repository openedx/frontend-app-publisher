import {
  COURSE_SUBMITTING_CANCEL,
  COURSE_SUBMITTING_SUCCESS,
  COURSE_SUBMITTING_INFO,
  COURSE_SUBMITTING_FAILURE,
} from '../constants/courseSubmitInfo';

function courseSubmittingCancel() {
  return { type: COURSE_SUBMITTING_CANCEL };
}

function courseSubmittingFailure(errors) {
  return { type: COURSE_SUBMITTING_FAILURE, errors };
}

function courseSubmittingInfo(targetRun = null) {
  return { type: COURSE_SUBMITTING_INFO, targetRun };
}

function courseSubmittingSuccess() {
  return { type: COURSE_SUBMITTING_SUCCESS };
}

function clearSubmitStatus() {
  return (dispatch) => {
    dispatch(courseSubmittingCancel());
  };
}

export {
  courseSubmittingCancel,
  courseSubmittingFailure,
  courseSubmittingInfo,
  courseSubmittingSuccess,
  clearSubmitStatus,
};

