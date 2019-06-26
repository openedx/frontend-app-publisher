import { connect } from 'react-redux';

import CourseTable from '../../components/CourseTable';
import { fetchOrganizations } from '../../data/actions/publisherUserInfo';

const mapStateToProps = state => ({
  authentication: state.authentication,
  publisherUserInfo: state.publisherUserInfo,
});

const mapDispatchToProps = {
  fetchOrganizations,
};

const CourseDashboard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CourseTable);

export default CourseDashboard;
