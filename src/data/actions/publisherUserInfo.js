import {
  REQUEST_USER_ORGANIZATIONS_FAIL,
  REQUEST_USER_ORGANIZATIONS_SUCCESS,
  REQUEST_USER_ORGANIZATIONS,
} from '../constants/publisherUserInfo';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

import { getErrorMessages } from '../../utils';

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

    return DiscoveryDataApiService.fetchOrganizations()
      .then((response) => {
        const organizations = response.data.results;
        dispatch(requestUserOrganizationsSuccess(organizations));
      })
      .catch((error) => {
        dispatch(requestUserOrganizationsFail(['Unable to retrieve user Organizations, please contact support.'].concat(getErrorMessages(error))));
      });
  };
}

export {
  requestUserOrganizationsFail,
  requestUserOrganizationsSuccess,
  requestUserOrganizations,
  fetchOrganizations,
};
