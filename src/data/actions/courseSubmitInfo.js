import COURSE_SUBMIT_INFO from '../constants/courseSubmitInfo';

export default function courseSubmitInfo(targetRun = null) {
  return { type: COURSE_SUBMIT_INFO, targetRun };
}
