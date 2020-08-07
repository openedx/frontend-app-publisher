import {
  CREATE_COLLABORATOR,
  CREATE_COLLABORATOR_SUCCESS,
  CREATE_COLLABORATOR_FAIL,
  EDIT_COLLABORATOR_INFO,
  EDIT_COLLABORATOR_INFO_SUCCESS,
  EDIT_COLLABORATOR_INFO_FAIL,
  CANCEL_COLLABORATOR_INFO,
  RESET_COLLABORATOR_INFO,
} from '../constants/collaboratorInfo';

const initialState = {
  data: {},
  isSaving: false,
  isFetching: false,
  error: null,
  returnToEditCourse: false,
};

function CollaboratorInfo(state = initialState, action) {
  switch (action.type) {
    case CREATE_COLLABORATOR:
      return {
        ...state,
        data: {},
        isSaving: true,
        error: null,
      };
    case CREATE_COLLABORATOR_SUCCESS:
      return {
        ...state,
        data: action.data,
        isSaving: false,
        error: null,
        returnToEditCourse: true,
      };
    case CREATE_COLLABORATOR_FAIL:
      return {
        ...state,
        data: {},
        isSaving: false,
        error: action.error,
      };
    case EDIT_COLLABORATOR_INFO:
      return {
        ...state,
        data: {},
        isSaving: true,
        error: null,
      };
    case EDIT_COLLABORATOR_INFO_SUCCESS:
      return {
        ...state,
        data: action.data,
        isSaving: false,
        error: null,
        returnToEditCourse: true,
      };
    case EDIT_COLLABORATOR_INFO_FAIL:
      return {
        ...state,
        data: {},
        isSaving: false,
        error: action.error,
      };
    case CANCEL_COLLABORATOR_INFO:
      return { ...state, returnToEditCourse: true };
    case RESET_COLLABORATOR_INFO:
      return initialState;
    default:
      return state;
  }
}

export default CollaboratorInfo;
