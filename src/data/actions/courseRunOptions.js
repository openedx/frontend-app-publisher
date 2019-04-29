import {
  REQUEST_COURSE_RUN_OPTIONS_FAIL,
  REQUEST_COURSE_RUN_OPTIONS_SUCCESS,
  REQUEST_COURSE_RUN_OPTIONS,
} from '../constants/courseRunOptions';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';
import { getErrorMessages } from '../../utils';

function requestCourseRunOptionsFail(error) {
  return { type: REQUEST_COURSE_RUN_OPTIONS_FAIL, error };
}

function requestCourseRunOptionsSuccess(data) {
  return { type: REQUEST_COURSE_RUN_OPTIONS_SUCCESS, data };
}

function requestCourseRunOptions() {
  return { type: REQUEST_COURSE_RUN_OPTIONS };
}

function fetchCourseRunOptions() {
  return (dispatch) => {
    dispatch(requestCourseRunOptions());

    return DiscoveryDataApiService.fetchCourseRunOptions()
      .then((response) => {
        const courseRun = response.data;

        // Confirm it looks vaguely correct
        if (!courseRun || !('actions' in courseRun)) {
          throw Error('Did not understand response.');
        }

        dispatch(requestCourseRunOptionsSuccess(courseRun));
      })
      .catch((error) => {
        dispatch(requestCourseRunOptionsFail(['Could not get course run information.'].concat(getErrorMessages(error))));
      });
  };
}
export {
  requestCourseRunOptionsFail,
  requestCourseRunOptionsSuccess,
  requestCourseRunOptions,
  fetchCourseRunOptions,
};
