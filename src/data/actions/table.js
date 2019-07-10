import { getPageOptionsFromUrl } from '../../utils';

import {
  PAGINATION_REQUEST,
  PAGINATION_SUCCESS,
  PAGINATION_FAILURE,
  SORT_REQUEST,
  SORT_SUCCESS,
  SORT_FAILURE,
  FILTER_REQUEST,
  FILTER_SUCCESS,
  FILTER_FAILURE,
  CLEAR_TABLE,
} from '../constants/table';

const paginationRequest = (tableId, page, pageSize) => ({
  type: PAGINATION_REQUEST,
  payload: {
    tableId,
    page,
    pageSize,
  },
});

const paginationSuccess = (tableId, data, ordering, page, pageSize) => ({
  type: PAGINATION_SUCCESS,
  payload: {
    tableId,
    data,
    ordering,
    page,
    pageSize,
  },
});
const paginationFailure = (tableId, error) => ({
  type: PAGINATION_FAILURE,
  payload: {
    tableId,
    error,
  },
});

const sortRequest = (tableId, ordering) => ({
  type: SORT_REQUEST,
  payload: {
    tableId,
    ordering, // ordering passed for tracking purposes by beacon in data/store.js
  },
});

const sortSuccess = (tableId, ordering, data) => ({
  type: SORT_SUCCESS,
  payload: {
    tableId,
    ordering,
    data,
  },
});

const sortFailure = (tableId, error) => ({
  type: SORT_FAILURE,
  payload: {
    tableId,
    error,
  },
});

const filterRequest = (tableId, filter) => ({
  type: FILTER_REQUEST,
  payload: {
    tableId,
    filter,
  },
});

const filterSuccess = (tableId, filter, data) => ({
  type: FILTER_SUCCESS,
  payload: {
    tableId,
    filter,
    data,
  },
});

const filterFailure = (tableId, error) => ({
  type: FILTER_FAILURE,
  payload: {
    tableId,
    error,
  },
});

const paginateTable = (tableId, fetchMethod, pageNumber) => (
  (dispatch) => {
    const options = getPageOptionsFromUrl();
    if (pageNumber) {
      options.page = pageNumber;
    }
    dispatch(paginationRequest(tableId, options.page, options.page_size));
    return fetchMethod(options).then((response) => {
      dispatch(paginationSuccess(
        tableId, response.data, options.ordering,
        options.page, options.page_size,
      ));
    }).catch((error) => {
      // This endpoint returns a 404 if no data exists,
      // so we convert it to an empty response here.
      if (error.response && error.response.status === 404) {
        dispatch(paginationSuccess(
          tableId, { results: [] }, options.ordering,
          options.page, options.page_size,
        ));
        return;
      }
      dispatch(paginationFailure(tableId, error));
    });
  }
);

const sortTable = (tableId, fetchMethod, ordering) => (
  (dispatch) => {
    const options = {
      ...getPageOptionsFromUrl(),
      ordering,
    };
    dispatch(sortRequest(tableId, ordering));

    return fetchMethod(options).then((response) => {
      dispatch(sortSuccess(tableId, ordering, response.data));
    }).catch((error) => {
      dispatch(sortFailure(tableId, error));
    });
  }
);

const filterTable = (tableId, fetchMethod, filter) => (
  (dispatch) => {
    const options = {
      ...getPageOptionsFromUrl(),
      pubq: filter, // Internal API querystring param for title/key substring
    };
    dispatch(filterRequest(tableId, filter));

    return fetchMethod(options).then((response) => {
      dispatch(filterSuccess(tableId, filter, response.data));
    }).catch((error) => {
      dispatch(filterFailure(tableId, error));
    });
  }
);

const clearTable = tableId => dispatch => (dispatch({
  type: CLEAR_TABLE,
  payload: {
    tableId,
  },
}));

export {
  paginateTable,
  sortTable,
  clearTable,
  filterTable,
};
