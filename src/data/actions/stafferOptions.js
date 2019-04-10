import {
  REQUEST_STAFFER_OPTIONS_FAIL,
  REQUEST_STAFFER_OPTIONS_SUCCESS,
  REQUEST_STAFFER_OPTIONS,
} from '../constants/stafferOptions';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';


function requestStafferOptionsFail(error) {
  return { type: REQUEST_STAFFER_OPTIONS_FAIL, error };
}

function requestStafferOptionsSuccess(data) {
  return { type: REQUEST_STAFFER_OPTIONS_SUCCESS, data };
}

function requestStafferOptions() {
  return { type: REQUEST_STAFFER_OPTIONS };
}

function fetchStafferOptions() {
  return (dispatch) => {
    dispatch(requestStafferOptions());

    return DiscoveryDataApiService.fetchStafferOptions()
      .then((response) => {
        const stafferOptions = response.data;

        // Confirm it looks vaguely correct
        if (!stafferOptions || !('actions' in stafferOptions)) {
          throw Error('Did not understand response');
        }

        dispatch(requestStafferOptionsSuccess(stafferOptions));
      })
      .catch((error) => {
        dispatch(requestStafferOptionsFail(`Could not get instructor information. ${error.toString()}`));
      });
  };
}
export {
  requestStafferOptionsFail,
  requestStafferOptionsSuccess,
  requestStafferOptions,
  fetchStafferOptions,
};
