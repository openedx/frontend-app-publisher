import { push } from 'connected-react-router';

import {
  CREATE_STAFFER,
  CREATE_STAFFER_SUCCESS,
  CREATE_STAFFER_FAIL,
  REQUEST_STAFFER_INFO,
  REQUEST_STAFFER_INFO_SUCCESS,
  REQUEST_STAFFER_INFO_FAIL,
  EDIT_STAFFER_INFO,
  EDIT_STAFFER_INFO_SUCCESS,
  EDIT_STAFFER_INFO_FAIL,
  CANCEL_STAFFER_INFO,
  RESET_STAFFER_INFO,
} from '../constants/stafferInfo';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';
import { getErrorMessages } from '../../utils';

export function createNewStaffer(stafferData) {
  return { type: CREATE_STAFFER, stafferData };
}

export function stafferCreateSuccess(data) {
  return { type: CREATE_STAFFER_SUCCESS, data };
}

export function stafferCreateFail(error) {
  return { type: CREATE_STAFFER_FAIL, error };
}

export function createStaffer(stafferData, referrer = null) {
  return (dispatch) => {
    dispatch(createNewStaffer(stafferData));
    // Send create staffer POST
    return DiscoveryDataApiService.createStaffer(stafferData)
      .then((response) => {
        const staffer = response.data;
        dispatch(stafferCreateSuccess(staffer));

        // Redirect to referring page after a successful create
        if (referrer) {
          dispatch(push(referrer));
        }
      })
      .catch((error) => {
        dispatch(stafferCreateFail(['Instructor create failed, please try again or contact support.'].concat(getErrorMessages(error))));
      });
  };
}

export function requestStafferInfoFail(error) {
  return { type: REQUEST_STAFFER_INFO_FAIL, error };
}

export function requestStafferInfoSuccess(data) {
  return { type: REQUEST_STAFFER_INFO_SUCCESS, data };
}

export function requestStafferInfo() {
  return { type: REQUEST_STAFFER_INFO };
}

export function fetchStafferInfo(uuid) {
  return (dispatch) => {
    dispatch(requestStafferInfo(uuid));

    return DiscoveryDataApiService.fetchStaffer(uuid)
      .then((response) => {
        const stafferInfo = response.data;

        // Confirm it looks vaguely correct
        if (!stafferInfo || !('family_name' in stafferInfo)) {
          throw Error('Did not understand response.');
        }

        dispatch(requestStafferInfoSuccess(stafferInfo));
      })
      .catch((error) => {
        dispatch(requestStafferInfoFail(['Could not get instructor information.'].concat(getErrorMessages(error))));
      });
  };
}

export function editStafferInfoFail(error) {
  return { type: EDIT_STAFFER_INFO_FAIL, error };
}

export function editStafferInfoSuccess(data) {
  return { type: EDIT_STAFFER_INFO_SUCCESS, data };
}

export function editStafferInfo(data) {
  return { type: EDIT_STAFFER_INFO, data };
}

export function editStaffer(stafferData, referrer = null) {
  return (dispatch) => {
    dispatch(editStafferInfo(stafferData));
    // Send edit course PATCH
    return DiscoveryDataApiService.editStaffer(stafferData)
      .then((response) => {
        const staffer = response.data;
        dispatch(editStafferInfoSuccess(staffer));

        // Redirect to referring page after a successful edit
        if (referrer) {
          dispatch(push(referrer));
        }
      })
      .catch((error) => {
        dispatch(editStafferInfoFail(['Edit instructor failed, please try again or contact support.'].concat(getErrorMessages(error))));
      });
  };
}

export function cancelStafferInfo() {
  return { type: CANCEL_STAFFER_INFO };
}

export function resetStafferInfo() {
  return { type: RESET_STAFFER_INFO };
}
