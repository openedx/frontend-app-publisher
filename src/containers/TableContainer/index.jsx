import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import TableComponent from '../../components/TableComponent';
import { paginateTable, sortTable, filterTable, clearTable } from '../../data/actions/table';

const mapStateToProps = (state, ownProps) => {
  const tableState = state.table[ownProps.id] || {};
  return {
    data: tableState.data && tableState.data.results,
    currentPage: tableState.data && tableState.page,
    pageCount: (tableState.data && Math.ceil(tableState.data.count / tableState.pageSize)) || 1,
    ordering: tableState.ordering,
    loading: tableState.loading,
    error: tableState.error,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  paginateTable: (pageNumber) => {
    dispatch(paginateTable(ownProps.id, ownProps.fetchMethod, pageNumber));
  },
  sortTable: (ordering) => {
    dispatch(sortTable(ownProps.id, ownProps.fetchMethod, ordering));
  },
  filterTable: (filter) => {
    dispatch(filterTable(ownProps.id, ownProps.fetchMethod, filter));
  },
  clearTable: () => {
    dispatch(clearTable(ownProps.id));
  },
});

export { mapStateToProps };

const TableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(TableComponent);

export default withRouter(TableContainer);
