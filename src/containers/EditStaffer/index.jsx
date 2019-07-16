import { connect } from 'react-redux';

import StafferPage from '../../components/StafferPage';
import { fetchStafferInfo, editStaffer, cancelStafferInfo } from '../../data/actions/stafferInfo';
import { fetchStafferOptions } from '../../data/actions/stafferOptions';

const mapStateToProps = state => ({
  stafferOptions: state.stafferOptions,
  stafferInfo: state.stafferInfo,
  sourceInfo: state.sourceInfo,
});

const mergeProps = (stateProps, actionProps, { uuid }) => ({
  ...stateProps,
  fetchStafferInfo: () => actionProps.fetchStafferInfo(uuid),
  fetchStafferOptions: () => actionProps.fetchStafferOptions(),
  editStaffer: (stafferData, referrer = null) => actionProps.editStaffer(stafferData, referrer),
  cancelStafferInfo: () => actionProps.cancelStafferInfo(),
});

const mapDispatchToProps = {
  fetchStafferInfo,
  fetchStafferOptions,
  editStaffer,
  cancelStafferInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(StafferPage);
