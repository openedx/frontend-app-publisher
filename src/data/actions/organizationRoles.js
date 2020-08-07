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

    return Promise.all(ids.map(id => DiscoveryDataApiService.fetchOrganizationRoles(id, role)))
      .then((responses) => {
        // First, combine all the responses, removing duplicates
        const roles = {};
        responses.forEach((response) => {
          response.data.results.forEach((r) => {
            roles[r.id] = r;
          });
        });

        // Now we have an object that maps id -> full_names without duplicates.
        // Let's make it an array instead and sort it.
        const rolesArray = Object.values(roles);
        rolesArray.sort((a, b) => (
          a.user.full_name.localeCompare(b.user.full_name)
          || a.user.email.localeCompare(b.user.email)
        ));

        // And finally dispatch the resulting sorted array
        dispatch(requestOrganizationRolesSuccess(rolesArray));
      })
      .catch((error) => {
        const msg = ['Could not get organization roles.'].concat(getErrorMessages(error));
        dispatch(requestOrganizationRolesFail(msg));
      });
  };
}

export {
  fetchOrganizationRoles,
  requestOrganizationRoles,
  requestOrganizationRolesFail,
  requestOrganizationRolesSuccess,
};
