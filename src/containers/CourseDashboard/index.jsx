import { connect } from 'react-redux';

import CourseTable from '../../components/CourseTable';
import { fetchOrganizations } from '../../data/actions/publisherUserInfo';
import { withLocation, withNavigate } from '../../utils/hoc';

const mapStateToProps = state => ({
  publisherUserInfo: state.publisherUserInfo,
  table: state.table,
});

const mapDispatchToProps = {
  fetchOrganizations,
};

const CourseDashboard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withLocation(withNavigate(CourseTable)));

export default CourseDashboard;
