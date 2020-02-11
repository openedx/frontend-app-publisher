import {
  REQUEST_USER_ORGANIZATIONS_FAIL,
  REQUEST_USER_ORGANIZATIONS_SUCCESS,
  REQUEST_USER_ORGANIZATIONS,
} from '../constants/publisherUserInfo';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

function requestUserOrganizationsFail(error) {
  return { type: REQUEST_USER_ORGANIZATIONS_FAIL, error };
}

function requestUserOrganizationsSuccess(data) {
  return { type: REQUEST_USER_ORGANIZATIONS_SUCCESS, data };
}

function requestUserOrganizations() {
  return { type: REQUEST_USER_ORGANIZATIONS };
}

function fetchOrganizations() {
  return (dispatch) => {
    dispatch(requestUserOrganizations());
    return DiscoveryDataApiService.fetchOrganizations().subscribe(
      organizations => dispatch(requestUserOrganizationsSuccess(organizations)),
      error => dispatch(requestUserOrganizationsFail(error)),
    );
  };
}

export {
  requestUserOrganizationsFail,
  requestUserOrganizationsSuccess,
  requestUserOrganizations,
  fetchOrganizations,
};
