import {
  REQUEST_COLLABORATOR_OPTIONS,
  REQUEST_COLLABORATOR_OPTIONS_FAIL,
  REQUEST_COLLABORATOR_OPTIONS_SUCCESS,
} from '../constants/collaboratorOptions';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';
import { getErrorMessages } from '../../utils';

export function requestCollaboratorOptions(data) {
  return { type: REQUEST_COLLABORATOR_OPTIONS, data };
}

export function requestCollaboratorOptionsSuccess(data) {
  return { type: REQUEST_COLLABORATOR_OPTIONS_SUCCESS, data };
}

export function requestCollaboratorOptionsFail(error) {
  return { type: REQUEST_COLLABORATOR_OPTIONS_FAIL, error };
}

export function fetchCollaboratorOptions() {
  return (dispatch) => {
    dispatch(requestCollaboratorOptions({}));
    return DiscoveryDataApiService.fetchCollaborators()
      .then((response) => {
        dispatch(requestCollaboratorOptionsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(requestCollaboratorOptionsFail(
          ['Unable to fetch collaborators, please try again or contact support.'].concat(getErrorMessages(error)),
        ));
      });
  };
}
