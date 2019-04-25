import COURSE_SUBMIT_INFO from '../constants/courseSubmitInfo';


const initialState = {
  targetRun: null,
};

function courseSubmitInfo(state = initialState, action) {
  switch (action.type) {
    case COURSE_SUBMIT_INFO:
      return Object.assign({}, state, {
        targetRun: action.targetRun,
      });
    default:
      return state;
  }
}

export default courseSubmitInfo;
