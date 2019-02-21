import {
  FAIL_USER_ORGANIZATIONS,
  RECEIVE_USER_ORGANIZATIONS,
  REQUEST_USER_ORGANIZATIONS,
} from '../constants/publisherUserInfo';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

export function failUserOrganizations(error) {
  return { type: FAIL_USER_ORGANIZATIONS, error };
}

export function receiveUserOrganizations(data) {
  return { type: RECEIVE_USER_ORGANIZATIONS, data };
}

export function requestUserOrganizations() {
  return { type: REQUEST_USER_ORGANIZATIONS };
}

export function fetchOrganizations() {
  return (dispatch) => {
    dispatch(requestUserOrganizations());

    return DiscoveryDataApiService.fetchOrganizations()
      .then((response) => {
        const organizations = response.data.results;
        dispatch(receiveUserOrganizations(organizations));
      })
      .catch((error) => {
        dispatch(failUserOrganizations(`Unable to retrieve user Organizations, please contact support: Error( ${error.toString()} )`));
      });
  };
}

