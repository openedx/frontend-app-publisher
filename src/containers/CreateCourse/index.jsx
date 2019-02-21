import { connect } from 'react-redux';

import CreateCoursePage from '../../components/CreateCoursePage';
import { fetchOrganizations } from '../../data/actions/publisherUserInfo';
import { createCourse } from '../../data/actions/courseInfo';

const mapStateToProps = state => ({
  publisherUserInfo: state.publisherUserInfo,
  courseInfo: state.courseInfo,
});

const mapDispatchToProps = {
  createCourse,
  fetchOrganizations,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCoursePage);
