import { connect } from 'react-redux';

import StafferPage from '../../components/StafferPage';
import { createStaffer, resetStafferInfo, cancelStafferInfo } from '../../data/actions/stafferInfo';
import { fetchOrganizations } from '../../data/actions/publisherUserInfo';
import { withNavigate } from '../../utils/hoc';

const mapStateToProps = state => ({
  stafferInfo: state.stafferInfo,
  sourceInfo: state.sourceInfo,
  publisherUserInfo: state.publisherUserInfo,
});

const mapDispatchToProps = {
  fetchStafferInfo: resetStafferInfo,
  createStaffer,
  cancelStafferInfo,
  fetchOrganizations,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigate(StafferPage));
