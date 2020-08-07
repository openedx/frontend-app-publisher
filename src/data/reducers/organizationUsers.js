import {
  REQUEST_ORGANIZATION_USERS,
  REQUEST_ORGANIZATION_USERS_FAIL,
  REQUEST_ORGANIZATION_USERS_SUCCESS,
} from '../constants/organizationUsers';

const initialState = {
  data: [],
  error: null,
  isFetching: false,
};

function organizationUsers(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ORGANIZATION_USERS:
      return {
        ...state,
        data: [],
        error: null,
        isFetching: true,
      };
    case REQUEST_ORGANIZATION_USERS_FAIL:
      return {
        ...state,
        data: [],
        error: action.error,
        isFetching: false,
      };
    case REQUEST_ORGANIZATION_USERS_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
        isFetching: false,
      };
    default:
      return state;
  }
}

export default organizationUsers;
