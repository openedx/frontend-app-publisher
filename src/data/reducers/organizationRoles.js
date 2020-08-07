import {
  REQUEST_ORGANIZATION_ROLES,
  REQUEST_ORGANIZATION_ROLES_FAIL,
  REQUEST_ORGANIZATION_ROLES_SUCCESS,
} from '../constants/organizationRoles';

const initialState = {
  data: [],
  error: null,
  isFetching: false,
};

function organizationRoles(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ORGANIZATION_ROLES:
      return {
        ...state,
        data: [],
        error: null,
        isFetching: true,
      };
    case REQUEST_ORGANIZATION_ROLES_FAIL:
      return {
        ...state,
        data: [],
        error: action.error,
        isFetching: false,
      };
    case REQUEST_ORGANIZATION_ROLES_SUCCESS:
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

export default organizationRoles;
