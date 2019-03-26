// import { push } from 'connected-react-router';

import {
  CREATE_INSTRUCTOR,
  CREATE_INSTRUCTOR_SUCCESS,
  CREATE_INSTRUCTOR_FAIL,
} from '../constants/instructorInfo';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

export function createNewInstructor(instructorData) {
  return { type: CREATE_INSTRUCTOR, instructorData };
}

export function instructorCreateSuccess(data) {
  return { type: CREATE_INSTRUCTOR_SUCCESS, data };
}

export function instructorCreateFail(error) {
  return { type: CREATE_INSTRUCTOR_FAIL, error };
}

export function createInstructor(instructorData) {
  return (dispatch) => {
    dispatch(createNewInstructor(instructorData));
    // Send create instructor POST
    return DiscoveryDataApiService.createInstructor(instructorData)
      .then((response) => {
        const instructor = response.data;
        dispatch(instructorCreateSuccess(instructor));
      })
      .catch((error) => {
        dispatch(instructorCreateFail(`Instructor create failed, please try again or contact support. Error( ${error.response.data} )`));
      });
  };
}
