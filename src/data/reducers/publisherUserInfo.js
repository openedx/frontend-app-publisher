import {
  REQUEST_USER_ORGANIZATIONS,
  REQUEST_USER_ORGANIZATIONS_SUCCESS,
  REQUEST_USER_ORGANIZATIONS_FAIL,
} from '../constants/publisherUserInfo';

const initialState = {
  organizations: [],
  isFetching: true,
  error: null,
};

function publisherUserInfo(state = initialState, action) {
  switch (action.type) {
    case REQUEST_USER_ORGANIZATIONS:
      return {
        ...state,
        organizations: [],
        isFetching: true,
        error: null,
      };
    case REQUEST_USER_ORGANIZATIONS_SUCCESS:
      return {
        ...state,
        organizations: action.data,
        isFetching: false,
        error: null,
      };
    case REQUEST_USER_ORGANIZATIONS_FAIL:
      return {
        ...state,
        organizations: [],
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export default publisherUserInfo;
