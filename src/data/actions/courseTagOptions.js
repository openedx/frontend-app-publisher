import {
  REQUEST_COURSE_TAG_OPTIONS,
  REQUEST_COURSE_TAG_OPTIONS_FAIL,
  REQUEST_COURSE_TAG_OPTIONS_SUCCESS,
} from '../constants/couseTagOptions';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';
import { getErrorMessages } from '../../utils';

export function requestCourseTagOptions(data) {
  return { type: REQUEST_COURSE_TAG_OPTIONS, data };
}

export function requestCourseTagOptionsSuccess(data) {
  return { type: REQUEST_COURSE_TAG_OPTIONS_SUCCESS, data };
}

export function requestCourseTagOptionsFail(error) {
  return { type: REQUEST_COURSE_TAG_OPTIONS_FAIL, error };
}

export function fetchCourseTagOptions() {
  return (dispatch) => {
    dispatch(requestCourseTagOptions({}));
    return DiscoveryDataApiService.fetchCourseTags()
      .then((response) => {
        dispatch(requestCourseTagOptionsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(requestCourseTagOptionsFail(
          ['Unable to fetch course tags, please try again or contact support.'].concat(getErrorMessages(error)),
        ));
      });
  };
}
