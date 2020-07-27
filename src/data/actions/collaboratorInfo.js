import { push } from 'connected-react-router';

import {
  CREATE_COLLABORATOR,
  CREATE_COLLABORATOR_SUCCESS,
  CREATE_COLLABORATOR_FAIL,
  EDIT_COLLABORATOR_INFO,
  EDIT_COLLABORATOR_INFO_SUCCESS,
  EDIT_COLLABORATOR_INFO_FAIL,
  CANCEL_COLLABORATOR_INFO,
  RESET_COLLABORATOR_INFO,
} from '../constants/collaboratorInfo';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';
import { getErrorMessages } from '../../utils';

export function createNewCollaborator(collaboratorData) {
  return { type: CREATE_COLLABORATOR, collaboratorData };
}

export function collaboratorCreateSuccess(data) {
  return { type: CREATE_COLLABORATOR_SUCCESS, data };
}

export function collaboratorCreateFail(error) {
  return { type: CREATE_COLLABORATOR_FAIL, error };
}

export function editCollaboratorInfoFail(error) {
  return { type: EDIT_COLLABORATOR_INFO_FAIL, error };
}

export function editCollaboratorInfoSuccess(data) {
  return { type: EDIT_COLLABORATOR_INFO_SUCCESS, data };
}

export function editCollaboratorInfo(data) {
  return { type: EDIT_COLLABORATOR_INFO, data };
}

export function createCollaborator(collaboratorData, referrer = null) {
  return (dispatch) => {
    dispatch(createNewCollaborator(collaboratorData));
    return DiscoveryDataApiService.createCollaborator(collaboratorData)
      .then((response) => {
        const collaborator = response.data;
        dispatch(collaboratorCreateSuccess(collaborator));

        if (referrer) {
          dispatch(push(referrer));
        }
      })
      .catch((error) => {
        dispatch(collaboratorCreateFail(['Collaborator create failed, please try again or contact support.'].concat(getErrorMessages(error))));
      });
  };
}

export function editCollaborator(collaboratorData, referrer = null) {
  return (dispatch) => {
    dispatch(editCollaboratorInfo(collaboratorData));
    // Send edit course PATCH
    return DiscoveryDataApiService.editCollaborator(collaboratorData)
      .then((response) => {
        const collaborator = response.data;
        dispatch(editCollaboratorInfoSuccess(collaborator));

        // Redirect to referring page after a successful edit
        if (referrer) {
          dispatch(push(referrer));
        }
      })
      .catch((error) => {
        dispatch(editCollaboratorInfoFail(['Edit collaborator failed, please try again or contact support.'].concat(getErrorMessages(error))));
      });
  };
}

export function cancelCollaboratorInfo() {
  return { type: CANCEL_COLLABORATOR_INFO };
}

export function resetCollaboratorInfo() {
  return { type: RESET_COLLABORATOR_INFO };
}
