import { connect } from 'react-redux';

import StafferPage from '../../components/StafferPage';
import { createStaffer, resetStafferInfo } from '../../data/actions/stafferInfo';
import { fetchStafferOptions } from '../../data/actions/stafferOptions';

const mapStateToProps = state => ({
  stafferOptions: state.stafferOptions,
  stafferInfo: state.stafferInfo,
  sourceInfo: state.sourceInfo,
});

const mapDispatchToProps = {
  fetchStafferInfo: resetStafferInfo,
  fetchStafferOptions,
  createStaffer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StafferPage);
