import {
  REQUEST_ORGANIZATION_USERS,
  REQUEST_ORGANIZATION_USERS_FAIL,
  REQUEST_ORGANIZATION_USERS_SUCCESS,
} from '../constants/organizationUsers';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

import { getErrorMessages } from '../../utils';

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

    return Promise.all(ids.map(id => DiscoveryDataApiService.fetchOrganizationUsers(id)))
      .then((responses) => {
        // First, combine all the responses, removing duplicates
        const users = {};
        responses.forEach((response) => {
          if (response) {
            response.data.results.forEach((user) => {
              users[user.id] = user;
            });
          }
        });

        // Now we have an object that maps id -> full_names without duplicates.
        // Let's make it an array instead and sort it.
        const usersArray = Object.values(users);
        usersArray.sort((a, b) => (
          a.full_name.localeCompare(b.full_name) || a.email.localeCompare(b.email)
        ));

        // And finally dispatch the resulting sorted array
        dispatch(requestOrganizationUsersSuccess(usersArray));
      })
      .catch((error) => {
        const msg = ['A problem occurred while retrieving users for this organization.']
          .concat(getErrorMessages(error));
        dispatch(requestOrganizationUsersFail(msg));
      });
  };
}

export {
  fetchOrganizationUsers,
  requestOrganizationUsers,
  requestOrganizationUsersFail,
  requestOrganizationUsersSuccess,
};
