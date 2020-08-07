import {
  REQUEST_COURSE_OPTIONS_FAIL,
  REQUEST_COURSE_OPTIONS_SUCCESS,
  REQUEST_COURSE_OPTIONS,
} from '../constants/courseOptions';

import { getErrorMessages } from '../../utils';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

function requestCourseOptionsFail(error) {
  return { type: REQUEST_COURSE_OPTIONS_FAIL, error };
}

function requestCourseOptionsSuccess(data) {
  return { type: REQUEST_COURSE_OPTIONS_SUCCESS, data };
}

function requestCourseOptions() {
  return { type: REQUEST_COURSE_OPTIONS };
}

function fetchCourseOptions() {
  return (dispatch) => {
    dispatch(requestCourseOptions());

    return DiscoveryDataApiService.fetchCourseOptions()
      .then((response) => {
        const course = response.data;

        // Confirm it looks vaguely correct
        if (!course || !('actions' in course)) {
          throw Error('Did not understand response.');
        }

        dispatch(requestCourseOptionsSuccess(course));
      })
      .catch((error) => {
        dispatch(requestCourseOptionsFail(['Could not get course information.'].concat(getErrorMessages(error))));
      });
  };
}
export {
  requestCourseOptionsFail,
  requestCourseOptionsSuccess,
  requestCourseOptions,
  fetchCourseOptions,
};
