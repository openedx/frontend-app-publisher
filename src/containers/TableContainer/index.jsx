import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import TableComponent from '../../components/TableComponent';
import {
  paginateTable, sortTable, fetchEditorFilterOptions, filterTable, clearTable,
} from '../../data/actions/table';
import { PAGE_SIZE } from '../../data/constants/table';

const mapStateToProps = (state) => {
  const tableState = state.table || {};
  return {
    data: tableState.data && tableState.data.results,
    pageCount: (tableState.data && Math.ceil(tableState.data.count / PAGE_SIZE)) || 1,
    loading: tableState.loading,
    error: tableState.error,
    editorFilterOptions: tableState.editorFilterOptions,
    editorFilterOptionsError: tableState.editorFilterOptionsError,
  };
};

const mapDispatchToProps = dispatch => ({
  paginateTable: (pageNumber) => {
    dispatch(paginateTable(pageNumber));
  },
  sortTable: (ordering) => {
    dispatch(sortTable(ordering));
  },
  filterTable: (filter) => {
    dispatch(filterTable(filter));
  },
  clearTable: () => {
    dispatch(clearTable());
  },
  fetchEditorFilterOptions: () => {
    dispatch(fetchEditorFilterOptions());
  },
});

export { mapStateToProps };

const TableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true },
)(TableComponent);

export default withRouter(TableContainer);
