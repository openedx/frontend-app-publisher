import {
  REQUEST_COURSE_OPTIONS_FAIL,
  REQUEST_COURSE_OPTIONS_SUCCESS,
  REQUEST_COURSE_OPTIONS,
} from '../constants/courseOptions';

import { UUID_REGEX } from '../constants/courseInfo';

import { getErrorMessages } from '../../utils';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';


function requestCourseOptionsFail(id, error) {
  return { type: REQUEST_COURSE_OPTIONS_FAIL, id, error };
}

function requestCourseOptionsSuccess(id, data) {
  return { type: REQUEST_COURSE_OPTIONS_SUCCESS, id, data };
}

function requestCourseOptions(id) {
  return { type: REQUEST_COURSE_OPTIONS, id };
}

function fetchCourseOptions(id) {
  return (dispatch) => {
    // We only support UUIDs right now, not course keys
    if (!UUID_REGEX.test(id)) {
      const error = `Could not get course information. ${id} is not a valid course UUID.`;
      dispatch(requestCourseOptionsFail(id, [error]));
      return Promise.resolve(); // early exit with empty promise
    }

    dispatch(requestCourseOptions(id));

    return DiscoveryDataApiService.fetchCourseOptions(id)
      .then((response) => {
        const course = response.data;

        // Confirm it looks vaguely correct
        if (!course || !('actions' in course)) {
          throw Error('Did not understand response.');
        }

        dispatch(requestCourseOptionsSuccess(id, course));
      })
      .catch((error) => {
        dispatch(requestCourseOptionsFail(
          id,
          ['Could not get course information.'].concat(getErrorMessages(error)),
        ));
      });
  };
}
export {
  requestCourseOptionsFail,
  requestCourseOptionsSuccess,
  requestCourseOptions,
  fetchCourseOptions,
};
