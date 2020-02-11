import DiscoveryDataApiService from '../services/DiscoveryDataApiService';
import { getPageOptionsFromUrl } from '../../utils';

import {
  CLEAR_TABLE,
  FETCH_EDITOR_OPTIONS_SUCCESS,
  FETCH_EDITOR_OPTIONS_FAILURE,
  UPDATE_TABLE_REQUEST,
  UPDATE_TABLE_SUCCESS,
  UPDATE_TABLE_FAILURE,
} from '../constants/table';

const fetchEditorFilterOptionsSuccess = editors => ({
  type: FETCH_EDITOR_OPTIONS_SUCCESS,
  payload: {
    editors,
  },
});

const fetchEditorFilterOptionsFailure = error => ({
  type: FETCH_EDITOR_OPTIONS_FAILURE,
  payload: {
    error,
  },
});

const clearTable = () => ({
  type: CLEAR_TABLE,
});

const updateTableRequest = () => ({
  type: UPDATE_TABLE_REQUEST,
});

const updateTableSuccess = data => ({
  type: UPDATE_TABLE_SUCCESS,
  payload: {
    data,
  },
});

const updateTableFailure = error => ({
  type: UPDATE_TABLE_FAILURE,
  payload: {
    error,
  },
});

const fetchEditorFilterOptions = () => (
  dispatch => (
    DiscoveryDataApiService.fetchUsersForCurrentUser().subscribe(
      users => dispatch(fetchEditorFilterOptionsSuccess(users)),
      error => dispatch(fetchEditorFilterOptionsFailure(error)),
    )
  )
);

const paginateTable = pageNumber => (
  (dispatch) => {
    const options = getPageOptionsFromUrl();
    if (pageNumber) {
      options.page = pageNumber;
    }
    dispatch(updateTableRequest());
    DiscoveryDataApiService.fetchCourses(options).subscribe(
      data => dispatch(updateTableSuccess(data)),
      (error) => {
        if (error.response && error.response.status === 404) {
          dispatch(updateTableSuccess({ results: [] }));
        }
        dispatch(updateTableFailure(error));
      },
    );
  }
);

const sortTable = ordering => (
  (dispatch) => {
    const options = {
      ...getPageOptionsFromUrl(),
      ordering,
    };
    dispatch(updateTableRequest());
    DiscoveryDataApiService.fetchCourses(options).subscribe(
      data => dispatch(updateTableSuccess(data)),
      error => dispatch(updateTableFailure(error)),
    );
  }
);

const filterTable = filter => (
  (dispatch) => {
    const options = {
      ...getPageOptionsFromUrl(),
      ...filter, // Internal API querystring param for title/key substring
    };
    dispatch(updateTableRequest());
    DiscoveryDataApiService.fetchCourses(options).subscribe(
      data => dispatch(updateTableSuccess(data)),
      error => dispatch(updateTableFailure(error)),
    );
  }
);

export {
  paginateTable,
  sortTable,
  clearTable,
  filterTable,
  fetchEditorFilterOptions,
};
