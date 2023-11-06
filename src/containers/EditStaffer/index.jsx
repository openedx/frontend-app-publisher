import { connect } from 'react-redux';

import StafferPage from '../../components/StafferPage';
import { fetchStafferInfo, editStaffer, cancelStafferInfo } from '../../data/actions/stafferInfo';

import { fetchOrganizations } from '../../data/actions/publisherUserInfo';
import { withNavigate, withParams } from '../../utils/hoc';

const mapStateToProps = state => ({
  stafferInfo: state.stafferInfo,
  sourceInfo: state.sourceInfo,
  publisherUserInfo: state.publisherUserInfo,
});

const mergeProps = (stateProps, actionProps, { uuid }) => ({
  ...stateProps,
  fetchStafferInfo: () => actionProps.fetchStafferInfo(uuid),
  editStaffer: (stafferData, referrer = null) => actionProps.editStaffer(stafferData, referrer),
  cancelStafferInfo: () => actionProps.cancelStafferInfo(),
  fetchOrganizations: () => actionProps.fetchOrganizations(),
});

const mapDispatchToProps = {
  fetchStafferInfo,
  editStaffer,
  cancelStafferInfo,
  fetchOrganizations,
};

export default withParams(connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(withNavigate(StafferPage)));
