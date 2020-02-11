import {
  REQUEST_ORGANIZATION_ROLES,
  REQUEST_ORGANIZATION_ROLES_FAIL,
  REQUEST_ORGANIZATION_ROLES_SUCCESS,
} from '../constants/organizationRoles';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

import { getErrorMessages } from '../../utils';


function requestOrganizationRoles() {
  return { type: REQUEST_ORGANIZATION_ROLES };
}

function requestOrganizationRolesFail(error) {
  return { type: REQUEST_ORGANIZATION_ROLES_FAIL, error };
}

function requestOrganizationRolesSuccess(data) {
  return { type: REQUEST_ORGANIZATION_ROLES_SUCCESS, data };
}

function fetchOrganizationRoles(ids, role) {
  return (dispatch) => {
    dispatch(requestOrganizationRoles());

    DiscoveryDataApiService.fetchOrganizationRoles(ids, role).subscribe(
      roles => dispatch(requestOrganizationRolesSuccess(roles)),
      error => dispatch(requestOrganizationRolesFail(error)),
    );
  };
}

export {
  fetchOrganizationRoles,
  requestOrganizationRoles,
  requestOrganizationRolesFail,
  requestOrganizationRolesSuccess,
};
