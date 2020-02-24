import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  paginateTable,
  sortTable,
  filterTable,
  fetchEditorFilterOptions,
} from './table';

import {
  UPDATE_TABLE_REQUEST,
  UPDATE_TABLE_SUCCESS,
  UPDATE_TABLE_FAILURE,
  FETCH_EDITOR_OPTIONS_SUCCESS,
  FETCH_EDITOR_OPTIONS_FAILURE,
} from '../constants/table';

const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(axios);

describe('table actions', () => {
  const key = 'DemoX+TestCourse';
  beforeEach(() => {
    mockClient.reset();
  });

  it('handles pagination request ', () => {
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(200, JSON.stringify({
        results: [{
          key,
        }],
      }));
    const expectedActions = [
      {
        type: UPDATE_TABLE_REQUEST,
      },
      {
        payload: {
          data: {
            results: [
              {
                key,
              },
            ],
          },
        },
        type: UPDATE_TABLE_SUCCESS,
      },
    ];
    const store = mockStore();

    return store.dispatch(paginateTable(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles pagination failure', () => {
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(500);
    const expectedActions = [
      {
        type: UPDATE_TABLE_REQUEST,
      },
      {
        payload: {
          error: new Error('Request failed with status code 500'),
        },
        type: UPDATE_TABLE_FAILURE,
      },
    ];
    const store = mockStore();

    return store.dispatch(paginateTable(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a 404', () => {
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(404);
    const expectedActions = [
      {
        type: UPDATE_TABLE_REQUEST,
      },
      {
        payload: {
          data: {
            results: [], // 404s should result in an empty array
          },
        },
        type: UPDATE_TABLE_SUCCESS,
      },
    ];
    const store = mockStore();

    return store.dispatch(paginateTable(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a sort request', () => {
    const ordering = 'key';
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(200, JSON.stringify({
        results: [
          {
            key,
          },
          {
            key,
          },
        ],
      }));
    const expectedActions = [
      {
        type: UPDATE_TABLE_REQUEST,
      },
      {
        payload: {
          data: {
            results: [
              {
                key,
              },
              {
                key,
              },
            ],
          },
        },
        type: UPDATE_TABLE_SUCCESS,
      },
    ];
    const initialState = {
      loading: false,
      error: null,
      data: {},
      editorFilterOptions: [],
      editorFilterOptionsError: null,
    };
    const store = mockStore(initialState);

    return store.dispatch(sortTable(ordering)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a sort failure', () => {
    const ordering = 'key';
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(500);
    const expectedActions = [
      {
        type: UPDATE_TABLE_REQUEST,
      },
      {
        payload: {
          error: new Error('Request failed with status code 500'),
        },
        type: UPDATE_TABLE_FAILURE,
      },
    ];
    const initialState = {
      loading: false,
      error: null,
      data: {},
      editorFilterOptions: [],
      editorFilterOptionsError: null,
    };
    const store = mockStore(initialState);

    return store.dispatch(sortTable(ordering)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a filter request', () => {
    const filter = 'key';
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(200, JSON.stringify({
        results: [
          {
            key,
          },
          {
            key,
          },
        ],
      }));
    const expectedActions = [
      {
        type: UPDATE_TABLE_REQUEST,
      },
      {
        payload: {
          data: {
            results: [
              {
                key,
              },
              {
                key,
              },
            ],
          },
        },
        type: UPDATE_TABLE_SUCCESS,
      },
    ];
    const initialState = {
      loading: false,
      error: null,
      data: {},
      editorFilterOptions: [],
      editorFilterOptionsError: null,
    };
    const store = mockStore(initialState);

    return store.dispatch(filterTable(filter)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a filter failure', () => {
    const filter = 'key';
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(500);
    const expectedActions = [
      {
        type: UPDATE_TABLE_REQUEST,
      },
      {
        payload: {
          error: new Error('Request failed with status code 500'),
        },
        type: UPDATE_TABLE_FAILURE,
      },
    ];
    const initialState = {
      loading: false,
      error: null,
      data: {},
      editorFilterOptions: [],
      editorFilterOptionsError: null,
    };
    const store = mockStore(initialState);

    return store.dispatch(filterTable(filter)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a editor options success', () => {
    mockClient.onGet('http://localhost:18381/publisher/api/admins/organizations/users/')
      .replyOnce(200, JSON.stringify({
        results: [{ id: 'test-id', full_name: 'test-full-name' }],
      }));
    const expectedActions = [
      {
        type: FETCH_EDITOR_OPTIONS_SUCCESS,
        payload: {
          editors: [{ id: 'test-id', name: 'test-full-name' }],
        },
      },
    ];
    const initialState = {
      loading: false,
      error: null,
      data: {},
      editorFilterOptions: [],
      editorFilterOptionsError: null,
    };
    const store = mockStore(initialState);

    return store.dispatch(fetchEditorFilterOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a editor options failure', () => {
    mockClient.onGet('http://localhost:18381/publisher/api/admins/organizations/users/')
      .replyOnce(500);
    const expectedActions = [
      {
        payload: {
          error: new Error('Request failed with status code 500'),
        },
        type: FETCH_EDITOR_OPTIONS_FAILURE,
      },
    ];
    const initialState = {
      loading: false,
      error: null,
      data: {},
      editorFilterOptions: [],
      editorFilterOptionsError: null,
    };
    const store = mockStore(initialState);

    return store.dispatch(fetchEditorFilterOptions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
