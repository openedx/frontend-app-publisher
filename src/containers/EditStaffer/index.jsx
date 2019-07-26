import { connect } from 'react-redux';

import StafferPage from '../../components/StafferPage';
import { fetchStafferInfo, editStaffer, cancelStafferInfo } from '../../data/actions/stafferInfo';

const mapStateToProps = state => ({
  stafferInfo: state.stafferInfo,
  sourceInfo: state.sourceInfo,
});

const mergeProps = (stateProps, actionProps, { uuid }) => ({
  ...stateProps,
  fetchStafferInfo: () => actionProps.fetchStafferInfo(uuid),
  editStaffer: (stafferData, referrer = null) => actionProps.editStaffer(stafferData, referrer),
  cancelStafferInfo: () => actionProps.cancelStafferInfo(),
});

const mapDispatchToProps = {
  fetchStafferInfo,
  editStaffer,
  cancelStafferInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(StafferPage);
