import {
  REQUEST_COURSE_INFO,
  REQUEST_COURSE_INFO_SUCCESS,
  REQUEST_COURSE_INFO_FAIL,
  CLEAR_COURSE_INFO_ERRORS,
  CREATE_COURSE,
  CREATE_COURSE_CANCEL,
  CREATE_COURSE_SUCCESS,
  CREATE_COURSE_FAIL,
  CREATE_COURSE_RUN,
  CREATE_COURSE_RUN_SUCCESS,
  CREATE_COURSE_RUN_FAIL,
  EDIT_COURSE_INFO,
  EDIT_COURSE_SUCCESS,
  EDIT_COURSE_FAIL,
  CLEAR_COURSE_SAVED,
  CLEAR_COURSE_RUN_ALERT,
} from '../constants/courseInfo';
import { formatCollaboratorOptions } from '../../utils';

const initialState = {
  data: {},
  isFetching: false,
  isCreating: false,
  isSubmittingEdit: false,
  showCreateStatusAlert: false,
  error: null,
  courseSaved: false,
};

function courseInfo(state = initialState, action) {
  switch (action.type) {
    case REQUEST_COURSE_INFO_FAIL:
      return {
        ...state,
        data: {},
        isFetching: false,
        error: action.error,
      };
    case REQUEST_COURSE_INFO_SUCCESS:
      return {
        ...state,
        data: action.data.collaborators
          ? Object.assign(action.data, formatCollaboratorOptions(action.data.collaborators)) : action.data,
        isFetching: false,
        error: null,
      };
    case REQUEST_COURSE_INFO:
      return {
        ...state,
        data: {},
        isFetching: true,
        error: null,
      };
    case CLEAR_COURSE_INFO_ERRORS:
      return { ...state, error: null };
    case CREATE_COURSE:
      return {
        ...state,
        isCreating: true,
        error: null,
      };
    case CREATE_COURSE_CANCEL:
      return { ...state, isCreating: false };
    case CREATE_COURSE_SUCCESS:
      return {
        ...state,
        data: action.data,
        error: null,
      };
    case CREATE_COURSE_FAIL:
      return {
        ...state,
        isCreating: false,
        error: action.error,
      };
    case CREATE_COURSE_RUN:
      return {
        ...state,
        isCreating: true,
        error: null,
      };
    case CREATE_COURSE_RUN_SUCCESS:
      return {
        ...state,
        isCreating: false,
        showCreateStatusAlert: true,
        error: null,
      };
    case CREATE_COURSE_RUN_FAIL:
      return {
        ...state,
        isCreating: false,
        error: action.error,
      };
    case EDIT_COURSE_INFO:
      return {
        ...state,
        isSubmittingEdit: true,
        error: null,
      };
    case EDIT_COURSE_SUCCESS:
      return {
        ...state,
        data: action.data,
        isSubmittingEdit: false,
        error: null,
        courseSaved: true,
      };
    case EDIT_COURSE_FAIL:
      return {
        ...state,
        isSubmittingEdit: false,
        error: action.error,
      };
    case CLEAR_COURSE_SAVED:
      return { ...state, courseSaved: false };
    case CLEAR_COURSE_RUN_ALERT:
      return { ...state, showCreateStatusAlert: false };
    default:
      return state;
  }
}

export default courseInfo;
