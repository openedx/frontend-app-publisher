import {
  UPDATE_TABLE_REQUEST,
  UPDATE_TABLE_SUCCESS,
  UPDATE_TABLE_FAILURE,
  CLEAR_TABLE,
  FETCH_EDITOR_OPTIONS_SUCCESS, FETCH_EDITOR_OPTIONS_FAILURE,
} from '../constants/table';

import tableReducer from './table';

describe('table reducer', () => {
  const initialState = { // overwritten as old state for actions
    loading: false,
    error: null,
    data: {},
    editorFilterOptions: [],
    editorFilterOptionsError: null,
  };

  it('handles a default state', () => {
    expect(tableReducer(initialState, {})).toEqual(initialState);
  });

  it('handles a UPDATE_TABLE_REQUEST', () => {
    expect(tableReducer(initialState, {
      type: UPDATE_TABLE_REQUEST,
    })).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it('handles a UPDATE_TABLE_SUCCESS', () => {
    const newData = {
      results: 'NewResults',
    };
    expect(tableReducer(initialState, {
      type: UPDATE_TABLE_SUCCESS,
      payload: {
        data: newData,
      },
    })).toEqual({
      ...initialState,
      data: newData,
    });
  });

  it('handles a UPDATE_TABLE_FAILURE', () => {
    const newError = 'A new error';
    expect(tableReducer(initialState, {
      type: UPDATE_TABLE_FAILURE,
      payload: {
        error: newError,
      },
    })).toEqual({
      ...initialState,
      error: newError,
    });
  });

  it('handles a CLEAR_TABLE', () => {
    expect(tableReducer(initialState, {
      type: CLEAR_TABLE,
    })).toEqual({
      ...initialState,
    });
  });

  it('handles a FETCH_EDITOR_OPTIONS_SUCCESS', () => {
    const newEditor = { name: 'new-editor' };
    expect(tableReducer(initialState, {
      type: FETCH_EDITOR_OPTIONS_SUCCESS,
      payload: {
        editors: [newEditor],
      },
    })).toEqual({
      ...initialState,
      editorFilterOptions: [newEditor],
    });
  });

  it('handles a FETCH_EDITOR_OPTIONS_FAILURE', () => {
    const editorError = 'editor-error';
    expect(tableReducer(initialState, {
      type: FETCH_EDITOR_OPTIONS_FAILURE,
      payload: {
        error: editorError,
      },
    })).toEqual({
      ...initialState,
      editorFilterOptionsError: editorError,
    });
  });
});
