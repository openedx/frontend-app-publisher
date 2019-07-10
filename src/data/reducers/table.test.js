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

import tableReducer from './table';

describe('table reducer', () => {
  const tableId = 'TableID';
  const initialState = { // overwritten as old state for actions
    [tableId]: {
      loading: false,
      error: 'Some Error',
      ordering: 'key',
      page: 1,
      pageSize: 1,
      data: [{
        key: 'TableID',
      }],
    },
  };

  it('handles a default state', () => {
    expect(tableReducer(initialState, {})).toEqual(initialState);
  });

  it('handles a PAGINATION_REQUEST', () => {
    const newPage = 100;
    expect(tableReducer(initialState, {
      type: PAGINATION_REQUEST,
      payload: {
        tableId,
        page: newPage,
      },
    })).toEqual({
      [tableId]: {
        loading: true,
        error: null,
        page: newPage,
        ordering: initialState[tableId].ordering,
        pageSize: initialState[tableId].pageSize,
        data: initialState[tableId].data,
      },
    });
  });

  it('handles a PAGINATION_SUCCESS', () => {
    const newOrdering = '-key';
    const newPage = 100;
    const newPageSize = 200;
    const newData = [{
      key: 'NewKey',
    }];
    expect(tableReducer(initialState, {
      type: PAGINATION_SUCCESS,
      payload: {
        tableId,
        ordering: newOrdering,
        page: newPage,
        pageSize: newPageSize,
        data: newData,
      },
    })).toEqual({
      [tableId]: {
        loading: false,
        page: newPage,
        ordering: newOrdering,
        pageSize: newPageSize,
        data: newData,
        error: null,
      },
    });
  });

  it('handles a PAGINATION_FAILURE', () => {
    const newError = 'A new error';
    expect(tableReducer(initialState, {
      type: PAGINATION_FAILURE,
      payload: {
        tableId,
        error: newError,
      },
    })).toEqual({
      [tableId]: {
        loading: false,
        error: newError,
        page: initialState[tableId].page,
        ordering: initialState[tableId].ordering,
        pageSize: initialState[tableId].pageSize,
        data: initialState[tableId].data,
      },
    });
  });

  it('handles a SORT_REQUEST', () => {
    expect(tableReducer(initialState, {
      type: SORT_REQUEST,
      payload: {
        tableId,
      },
    })).toEqual({
      [tableId]: {
        loading: true,
        error: null,
        page: initialState[tableId].page,
        ordering: initialState[tableId].ordering,
        pageSize: initialState[tableId].pageSize,
        data: initialState[tableId].data,
      },
    });
  });

  it('handles a SORT_SUCCESS', () => {
    const newOrdering = '-key';
    const newData = [{
      key: 'NewKey',
    }];
    expect(tableReducer(initialState, {
      type: SORT_SUCCESS,
      payload: {
        tableId,
        ordering: newOrdering,
        data: newData,
      },
    })).toEqual({
      [tableId]: {
        loading: false,
        error: null,
        ordering: newOrdering,
        data: newData,
        page: initialState[tableId].page,
        pageSize: initialState[tableId].pageSize,
      },
    });
  });

  it('handles a SORT_FAILURE', () => {
    const newError = 'A new error';
    expect(tableReducer(initialState, {
      type: SORT_FAILURE,
      payload: {
        tableId,
        error: newError,
      },
    })).toEqual({
      [tableId]: {
        loading: false,
        error: newError,
        page: initialState[tableId].page,
        ordering: initialState[tableId].ordering,
        pageSize: initialState[tableId].pageSize,
        data: initialState[tableId].data,
      },
    });
  });

  it('handles a FILTER_REQUEST', () => {
    expect(tableReducer(initialState, {
      type: FILTER_REQUEST,
      payload: {
        tableId,
      },
    })).toEqual({
      [tableId]: {
        loading: true,
        error: null,
        page: initialState[tableId].page,
        ordering: initialState[tableId].ordering,
        pageSize: initialState[tableId].pageSize,
        data: initialState[tableId].data,
      },
    });
  });

  it('handles a FILTER_SUCCESS', () => {
    const newFilter = 'key';
    const newData = [{
      key: 'NewKey',
    }];
    expect(tableReducer(initialState, {
      type: FILTER_SUCCESS,
      payload: {
        tableId,
        filter: newFilter,
        data: newData,
      },
    })).toEqual({
      [tableId]: {
        loading: false,
        error: null,
        filter: newFilter,
        data: newData,
        page: initialState[tableId].page,
        pageSize: initialState[tableId].pageSize,
      },
    });
  });

  it('handles a FILTER_FAILURE', () => {
    const newError = 'A new error';
    expect(tableReducer(initialState, {
      type: FILTER_FAILURE,
      payload: {
        tableId,
        error: newError,
      },
    })).toEqual({
      [tableId]: {
        loading: false,
        error: newError,
        page: initialState[tableId].page,
        ordering: initialState[tableId].ordering,
        pageSize: initialState[tableId].pageSize,
        data: initialState[tableId].data,
      },
    });
  });

  it('handles a CLEAR_TABLE', () => {
    expect(tableReducer(initialState, {
      type: CLEAR_TABLE,
      payload: {
        tableId,
      },
    })).toEqual({
      [tableId]: {
        loading: false,
        error: null,
        ordering: null,
        data: null,
        page: initialState[tableId].page,
        pageSize: initialState[tableId].pageSize,
      },
    });
  });
});
