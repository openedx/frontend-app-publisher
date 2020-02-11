import {
  REQUEST_ORGANIZATION_USERS,
  REQUEST_ORGANIZATION_USERS_FAIL,
  REQUEST_ORGANIZATION_USERS_SUCCESS,
} from '../constants/organizationUsers';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

function requestOrganizationUsers() {
  return { type: REQUEST_ORGANIZATION_USERS };
}

function requestOrganizationUsersFail(error) {
  return { type: REQUEST_ORGANIZATION_USERS_FAIL, error };
}

function requestOrganizationUsersSuccess(data) {
  return { type: REQUEST_ORGANIZATION_USERS_SUCCESS, data };
}

function fetchOrganizationUsers(ids) {
  return (dispatch) => {
    dispatch(requestOrganizationUsers());
    DiscoveryDataApiService.fetchOrganizationUsers(ids).subscribe(
      users => dispatch(requestOrganizationUsersSuccess(users)),
      error => dispatch(requestOrganizationUsersFail(error)),
    );
  };
}

export {
  fetchOrganizationUsers,
  requestOrganizationUsers,
  requestOrganizationUsersFail,
  requestOrganizationUsersSuccess,
};
