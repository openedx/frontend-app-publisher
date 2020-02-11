import {
  COURSE_SUBMITTING_CANCEL,
  COURSE_SUBMITTING_SUCCESS,
  COURSE_SUBMIT_RUN,
  COURSE_RUN_SUBMITTING,
  COURSE_SUBMITTING_FAILURE,
  CLEAR_REVIEW_ALERT,
} from '../constants/courseSubmitInfo';

function courseSubmittingCancel() {
  return { type: COURSE_SUBMITTING_CANCEL };
}

function courseSubmittingFailure(errors) {
  return { type: COURSE_SUBMITTING_FAILURE, errors };
}

function courseSubmitRun(targetRun = null) {
  return { type: COURSE_SUBMIT_RUN, targetRun };
}

function courseRunSubmitting() {
  return { type: COURSE_RUN_SUBMITTING };
}

function courseSubmittingSuccess() {
  return { type: COURSE_SUBMITTING_SUCCESS };
}

function courseSubmittingInReview() {
  return { type: CLEAR_REVIEW_ALERT };
}

function clearSubmitStatus() {
  return (dispatch) => {
    dispatch(courseSubmittingCancel());
  };
}

function clearCourseReviewAlert() {
  return (dispatch) => {
    dispatch(courseSubmittingInReview());
  };
}

export {
  courseSubmittingCancel,
  courseSubmittingFailure,
  courseSubmitRun,
  courseRunSubmitting,
  courseSubmittingSuccess,
  clearCourseReviewAlert,
  clearSubmitStatus,
  courseSubmittingInReview,
};
