import {
  REQUEST_STAFFER_INFO,
  REQUEST_STAFFER_INFO_SUCCESS,
  REQUEST_STAFFER_INFO_FAIL,
  CREATE_STAFFER,
  CREATE_STAFFER_SUCCESS,
  CREATE_STAFFER_FAIL,
  EDIT_STAFFER_INFO,
  EDIT_STAFFER_INFO_SUCCESS,
  EDIT_STAFFER_INFO_FAIL,
  CANCEL_STAFFER_INFO,
  RESET_STAFFER_INFO,
} from '../constants/stafferInfo';

const initialState = {
  data: {},
  isSaving: false,
  isFetching: false,
  error: null,
  returnToEditCourse: false,
};

function stafferInfo(state = initialState, action) {
  switch (action.type) {
    case REQUEST_STAFFER_INFO:
      return {
        ...state,
        data: {},
        isSaving: false,
        isFetching: true,
        error: null,
      };
    case REQUEST_STAFFER_INFO_SUCCESS:
      return {
        ...state,
        data: action.data,
        isSaving: false,
        isFetching: false,
        error: null,
      };
    case REQUEST_STAFFER_INFO_FAIL:
      return {
        ...state,
        data: {},
        isSaving: false,
        isFetching: false,
        error: action.error,
      };
    case CREATE_STAFFER:
      return {
        ...state,
        data: {},
        isSaving: true,
        error: null,
      };
    case CREATE_STAFFER_SUCCESS:
      return {
        ...state,
        data: action.data,
        isSaving: false,
        error: null,
        returnToEditCourse: true,
      };
    case CREATE_STAFFER_FAIL:
      return {
        ...state,
        data: {},
        isSaving: false,
        error: action.error,
      };
    case EDIT_STAFFER_INFO:
      return {
        ...state,
        data: {},
        isSaving: true,
        error: null,
      };
    case EDIT_STAFFER_INFO_SUCCESS:
      return {
        ...state,
        data: action.data,
        isSaving: false,
        error: null,
        returnToEditCourse: true,
      };
    case EDIT_STAFFER_INFO_FAIL:
      return {
        ...state,
        data: {},
        isSaving: false,
        error: action.error,
      };
    case CANCEL_STAFFER_INFO:
      return { ...state, returnToEditCourse: true };
    case RESET_STAFFER_INFO:
      return initialState;
    default:
      return state;
  }
}

export default stafferInfo;
