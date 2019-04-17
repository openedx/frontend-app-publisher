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
};

function stafferInfo(state = initialState, action) {
  switch (action.type) {
    case REQUEST_STAFFER_INFO:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        isFetching: true,
        error: null,
      });
    case REQUEST_STAFFER_INFO_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isSaving: false,
        isFetching: false,
        error: null,
      });
    case REQUEST_STAFFER_INFO_FAIL:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        isFetching: false,
        error: action.error,
      });
    case CREATE_STAFFER:
      return Object.assign({}, state, {
        data: {},
        isSaving: true,
        error: null,
      });
    case CREATE_STAFFER_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isSaving: false,
        error: null,
      });
    case CREATE_STAFFER_FAIL:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        error: action.error,
      });
    case EDIT_STAFFER_INFO:
      return Object.assign({}, state, {
        data: {},
        isSaving: true,
        error: null,
      });
    case EDIT_STAFFER_INFO_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isSaving: false,
        error: null,
      });
    case EDIT_STAFFER_INFO_FAIL:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        error: action.error,
      });
    case EDIT_STAFFER_INFO_FINISH:
      return Object.assign({}, state, {
        data: {},
        isSaving: false,
        error: null,
      });
    default:
      return state;
  }
}

export default stafferInfo;
