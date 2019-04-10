import { connect } from 'react-redux';

import StafferPage from '../../components/StafferPage';
import { fetchStafferInfo, editStaffer } from '../../data/actions/stafferInfo';
import { fetchStafferOptions } from '../../data/actions/stafferOptions';

const mapStateToProps = state => ({
  stafferOptions: state.stafferOptions,
  stafferInfo: state.stafferInfo,
});

const mergeProps = (stateProps, actionProps, { uuid }) => ({
  ...stateProps,
  fetchStafferInfo: () => actionProps.fetchStafferInfo(uuid),
  fetchStafferOptions: () => actionProps.fetchStafferOptions(),
  editStaffer: stafferData => actionProps.editStaffer(stafferData),
});

const mapDispatchToProps = {
  fetchStafferInfo,
  fetchStafferOptions,
  editStaffer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(StafferPage);
