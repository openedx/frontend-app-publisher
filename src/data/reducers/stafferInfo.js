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
  EDIT_STAFFER_INFO_FINISH,
} from '../constants/stafferInfo';


const initialState = {
  data: {},
  isSaving: false,
  isFetching: false,
  error: null,
  wasEditSuccessful: false,
};

function stafferInfo(state = initialState, action) {
  switch (action.type) {
    case REQUEST_STAFFER_INFO:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        isFetching: true,
        error: null,
        wasEditSuccessful: false,
      });
    case REQUEST_STAFFER_INFO_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isSaving: false,
        isFetching: false,
        error: null,
        wasEditSuccessful: false,
      });
    case REQUEST_STAFFER_INFO_FAIL:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        isFetching: false,
        error: action.error,
        wasEditSuccessful: false,
      });
    case CREATE_STAFFER:
      return Object.assign({}, state, {
        data: {},
        isSaving: true,
        error: null,
        wasEditSuccessful: false,
      });
    case CREATE_STAFFER_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isSaving: false,
        error: null,
        wasEditSuccessful: false,
      });
    case CREATE_STAFFER_FAIL:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        error: action.error,
        wasEditSuccessful: false,
      });
    case EDIT_STAFFER_INFO:
      return Object.assign({}, state, {
        data: {},
        isSaving: true,
        error: null,
        wasEditSuccessful: false,
      });
    case EDIT_STAFFER_INFO_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isSaving: false,
        error: null,
        wasEditSuccessful: true,
      });
    case EDIT_STAFFER_INFO_FAIL:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        error: action.error,
        wasEditSuccessful: false,
      });
    case EDIT_STAFFER_INFO_FINISH:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        error: null,
        wasEditSuccessful: false,
      });
    default:
      return state;
  }
}

export default stafferInfo;
