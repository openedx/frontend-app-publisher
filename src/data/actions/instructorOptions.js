import {
  REQUEST_INSTRUCTOR_OPTIONS_FAIL,
  REQUEST_INSTRUCTOR_OPTIONS_SUCCESS,
  REQUEST_INSTRUCTOR_OPTIONS,
} from '../constants/instructorOptions';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';


function requestInstructorOptionsFail(error) {
  return { type: REQUEST_INSTRUCTOR_OPTIONS_FAIL, error };
}

function requestInstructorOptionsSuccess(data) {
  return { type: REQUEST_INSTRUCTOR_OPTIONS_SUCCESS, data };
}

function requestInstructorOptions() {
  return { type: REQUEST_INSTRUCTOR_OPTIONS };
}

function fetchInstructorOptions() {
  return (dispatch) => {
    dispatch(requestInstructorOptions());

    return DiscoveryDataApiService.fetchInstructorOptions()
      .then((response) => {
        const instructorOptions = response.data;

        // Confirm it looks vaguely correct
        if (!instructorOptions || !('actions' in instructorOptions)) {
          throw Error('Did not understand response');
        }

        dispatch(requestInstructorOptionsSuccess(instructorOptions));
      })
      .catch((error) => {
        dispatch(requestInstructorOptionsFail(`Could not get instructor information. ${error.toString()}`));
      });
  };
}
export {
  requestInstructorOptionsFail,
  requestInstructorOptionsSuccess,
  requestInstructorOptions,
  fetchInstructorOptions,
};
