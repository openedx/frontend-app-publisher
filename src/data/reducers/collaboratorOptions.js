import {
  REQUEST_COLLABORATOR_OPTIONS,
  REQUEST_COLLABORATOR_OPTIONS_SUCCESS,
  REQUEST_COLLABORATOR_OPTIONS_FAIL,
} from '../constants/collaboratorOptions';

const initialState = {
  data: {},
  isFetching: false,
};

function CollaboratorOptions(state = initialState, action) {
  switch (action.type) {
    case REQUEST_COLLABORATOR_OPTIONS:
      return {
        ...state,
        isFetching: false,
      };
    case REQUEST_COLLABORATOR_OPTIONS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetching: false,
      };
    case REQUEST_COLLABORATOR_OPTIONS_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
}

export default CollaboratorOptions;
