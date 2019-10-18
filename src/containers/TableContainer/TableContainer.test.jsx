import { mapStateToProps } from './index';

describe('TableContainer', () => {
  it('should have default map state to props', () => {
    // const tableId = 'TestId';
    // const count = 1;
    // const page = 1;
    // const pageSize = 1;
    // const ordering = 'key';
    // const loading = false;
    // const error = null;
    const initialState = {
      table: {
        loading: false,
        error: null,
        data: { results: {} },
        editorFilterOptions: [],
        editorFilterOptionsError: null,
      },
    };
    const mappedState = mapStateToProps(initialState);
    expect(mappedState.loading).toEqual(initialState.table.loading);
    expect(mappedState.error).toEqual(initialState.table.error);
    expect(mappedState.data).toEqual(initialState.table.data.results);
    expect(mappedState.editorFilterOptions).toEqual(initialState.table.editorFilterOptions);
    expect(mappedState.editorFilterOptionsError)
      .toEqual(initialState.table.editorFilterOptionsError);
  });
});
