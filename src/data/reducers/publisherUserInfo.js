import {
  REQUEST_USER_ORGANIZATIONS,
  RECEIVE_USER_ORGANIZATIONS,
  FAIL_USER_ORGANIZATIONS,
} from '../constants/publisherUserInfo';


const initialState = {
  organizations: [],
  isFetching: true,
  error: null,
};

function publisherUserInfo(state = initialState, action) {
  switch (action.type) {
    case REQUEST_USER_ORGANIZATIONS:
      return Object.assign({}, state, {
        organizations: [],
        isFetching: true,
        error: null,
      });
    case RECEIVE_USER_ORGANIZATIONS:
      return Object.assign({}, state, {
        organizations: action.data,
        isFetching: false,
        error: null,
      });
    case FAIL_USER_ORGANIZATIONS:
      return Object.assign({}, state, {
        organizations: [],
        isFetching: false,
        error: action.error,
      });
    default:
      return state;
  }
}

export default publisherUserInfo;
