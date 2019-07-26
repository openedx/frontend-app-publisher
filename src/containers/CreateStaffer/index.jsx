import { connect } from 'react-redux';

import StafferPage from '../../components/StafferPage';
import { createStaffer, resetStafferInfo, cancelStafferInfo } from '../../data/actions/stafferInfo';

const mapStateToProps = state => ({
  stafferInfo: state.stafferInfo,
  sourceInfo: state.sourceInfo,
});

const mapDispatchToProps = {
  fetchStafferInfo: resetStafferInfo,
  createStaffer,
  cancelStafferInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StafferPage);
