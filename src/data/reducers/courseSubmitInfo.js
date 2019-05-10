import {
  COURSE_SUBMITTING_CANCEL,
  COURSE_SUBMITTING_FAILURE,
  COURSE_SUBMITTING_INFO,
  COURSE_SUBMITTING_SUCCESS,
} from '../constants/courseSubmitInfo';


const initialState = {
  targetRun: null,
  isSubmittingRunReview: false,
};

function courseSubmitInfo(state = initialState, action) {
  switch (action.type) {
    case COURSE_SUBMITTING_INFO:
      return Object.assign({}, state, {
        targetRun: action.targetRun,
        isSubmittingRunReview: (action.targetRun != null),
      });
    case COURSE_SUBMITTING_SUCCESS:
      return Object.assign({}, state, {
        isSubmittingRunReview: false,
      });
    case COURSE_SUBMITTING_CANCEL:
      return Object.assign({}, state, {
        isSubmittingRunReview: false,
      });
    case COURSE_SUBMITTING_FAILURE:
      return Object.assign({}, state, {
        isSubmittingRunReview: false,
      });
    default:
      return state;
  }
}

export default courseSubmitInfo;
