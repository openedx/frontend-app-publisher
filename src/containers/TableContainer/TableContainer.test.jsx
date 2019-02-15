import { mapStateToProps } from './index';

describe('TableContainer', () => {
  it('should have default map state to props', () => {
    const tableId = 'TestId';
    const count = 1;
    const page = 1;
    const pageSize = 1;
    const ordering = 'key';
    const loading = false;
    const error = null;
    const initialState = {
      table: {
        [tableId]: {
          data: {
            count,
            results: [
              {
                key: tableId,
              },
            ],
          },
          page,
          pageSize,
          ordering,
          loading,
          error,
        },
      },
    };
    const mappedState = mapStateToProps(initialState, { id: tableId });
    expect(mappedState.data).toEqual(initialState.table[tableId].data.results);
    expect(mappedState.currentPage).toEqual(initialState.table[tableId].page);
    expect(mappedState.pageCount).toEqual(1); // data.count / pageSize
    expect(mappedState.ordering).toEqual(initialState.table[tableId].ordering);
    expect(mappedState.loading).toEqual(initialState.table[tableId].loading);
    expect(mappedState.error).toEqual(initialState.table[tableId].error);
  });
});
