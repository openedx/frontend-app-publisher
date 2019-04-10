import {
  REQUEST_STAFFER_OPTIONS_FAIL,
  REQUEST_STAFFER_OPTIONS_SUCCESS,
  REQUEST_STAFFER_OPTIONS,
} from '../constants/stafferOptions';


const initialState = {
  data: {},
  isFetching: false,
  error: null,
};

function stafferOptions(state = initialState, action) {
  switch (action.type) {
    case REQUEST_STAFFER_OPTIONS_FAIL:
      return Object.assign({}, state, {
        data: {},
        isFetching: false,
        error: action.error,
      });
    case REQUEST_STAFFER_OPTIONS_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        isFetching: false,
        error: null,
      });
    case REQUEST_STAFFER_OPTIONS:
      return Object.assign({}, state, {
        data: {},
        isFetching: true,
        error: null,
      });
    default:
      return state;
  }
}

export default stafferOptions;
