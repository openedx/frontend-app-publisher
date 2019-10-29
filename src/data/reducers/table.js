import {
  CLEAR_TABLE,
  FETCH_EDITOR_OPTIONS_SUCCESS,
  FETCH_EDITOR_OPTIONS_FAILURE,
  UPDATE_TABLE_REQUEST,
  UPDATE_TABLE_SUCCESS,
  UPDATE_TABLE_FAILURE,
} from '../constants/table';

const initialState = {
  loading: false,
  error: null,
  data: {},
  editorFilterOptions: [],
  editorFilterOptionsError: null,
};

const tableReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TABLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_TABLE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload.data,
      };
    case UPDATE_TABLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case FETCH_EDITOR_OPTIONS_SUCCESS:
      return {
        ...state,
        editorFilterOptions: action.payload.editors,
      };
    case FETCH_EDITOR_OPTIONS_FAILURE:
      return {
        ...state,
        editorFilterOptionsError: action.payload.error,
      };
    case CLEAR_TABLE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default tableReducer;
