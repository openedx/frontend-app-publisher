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

    return DiscoveryDataApiService.fetchCourseOptions().subscribe(
      options => dispatch(requestCourseOptionsSuccess(options)),
      error => dispatch(requestCourseOptionsFail(error)),
    );
  };
}
export {
  requestCourseOptionsFail,
  requestCourseOptionsSuccess,
  requestCourseOptions,
  fetchCourseOptions,
};
