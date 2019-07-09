import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import apiClient from '../apiClient';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';

import {
  paginateTable,
  sortTable,
  filterTable,
} from './table';

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
} from '../constants/table';

const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(apiClient);
apiClient.isAccessTokenExpired = jest.fn();
apiClient.isAccessTokenExpired.mockReturnValue(false);

describe('table actions', () => {
  const page = 1;
  const pageSize = 50;
  const tableId = 'TestId';
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
        payload: {
          page,
          pageSize,
          tableId,
        },
        type: PAGINATION_REQUEST,
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
          ordering: undefined, // No ordering set
          page,
          pageSize,
          tableId,
        },
        type: PAGINATION_SUCCESS,
      },
    ];
    const store = mockStore();

    return store.dispatch(paginateTable(
      tableId,
      DiscoveryDataApiService.fetchCourses,
      1,
    )).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles pagination failure', () => {
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(500);
    const expectedActions = [
      {
        payload: {
          page,
          pageSize,
          tableId,
        },
        type: PAGINATION_REQUEST,
      },
      {
        payload: {
          error: new Error('Request failed with status code 500'),
          tableId,
        },
        type: PAGINATION_FAILURE,
      },
    ];
    const store = mockStore();

    return store.dispatch(paginateTable(
      tableId,
      DiscoveryDataApiService.fetchCourses,
      1,
    )).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a 404', () => {
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(404);
    const expectedActions = [
      {
        payload: {
          page,
          pageSize,
          tableId,
        },
        type: PAGINATION_REQUEST,
      },
      {
        payload: {
          data: {
            results: [], // 404s should result in an empty array
          },
          ordering: undefined, // No ordering set
          page,
          pageSize,
          tableId,
        },
        type: PAGINATION_SUCCESS,
      },
    ];
    const store = mockStore();

    return store.dispatch(paginateTable(
      tableId,
      DiscoveryDataApiService.fetchCourses,
      1,
    )).then(() => {
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
        payload: {
          ordering,
          tableId,
        },
        type: SORT_REQUEST,
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
          ordering,
          tableId,
        },
        type: SORT_SUCCESS,
      },
    ];
    const initialState = {
      table: {
        [tableId]: {}, // Just have an empty state for the table
      },
    };
    const store = mockStore(initialState);

    return store.dispatch(sortTable(
      tableId,
      DiscoveryDataApiService.fetchCourses,
      ordering,
    )).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a sort failure', () => {
    const ordering = 'key';
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(500);
    const expectedActions = [
      {
        payload: {
          ordering,
          tableId,
        },
        type: SORT_REQUEST,
      },
      {
        payload: {
          error: new Error('Request failed with status code 500'),
          tableId,
        },
        type: SORT_FAILURE,
      },
    ];
    const initialState = {
      table: {
        [tableId]: {}, // Just have an empty state for the table
      },
    };
    const store = mockStore(initialState);

    return store.dispatch(sortTable(
      tableId,
      DiscoveryDataApiService.fetchCourses,
      ordering,
    )).then(() => {
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
        payload: {
          filter,
          tableId,
        },
        type: FILTER_REQUEST,
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
          filter,
          tableId,
        },
        type: FILTER_SUCCESS,
      },
    ];
    const initialState = {
      table: {
        [tableId]: {}, // Just have an empty state for the table
      },
    };
    const store = mockStore(initialState);

    return store.dispatch(filterTable(
      tableId,
      DiscoveryDataApiService.fetchCourses,
      filter,
    )).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles a filter failure', () => {
    const filter = 'key';
    mockClient.onGet('http://localhost:18381/api/v1/courses/')
      .replyOnce(500);
    const expectedActions = [
      {
        payload: {
          filter,
          tableId,
        },
        type: FILTER_REQUEST,
      },
      {
        payload: {
          error: new Error('Request failed with status code 500'),
          tableId,
        },
        type: FILTER_FAILURE,
      },
    ];
    const initialState = {
      table: {
        [tableId]: {}, // Just have an empty state for the table
      },
    };
    const store = mockStore(initialState);

    return store.dispatch(filterTable(
      tableId,
      DiscoveryDataApiService.fetchCourses,
      filter,
    )).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
