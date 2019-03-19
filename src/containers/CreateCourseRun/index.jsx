import { connect } from 'react-redux';

import CreateCourseRunPage from '../../components/CreateCourseRunPage';
import { createCourseRun, fetchCourseInfo } from '../../data/actions/courseInfo';

const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
});

const mapDispatchToProps = {
  fetchCourseInfo,
  createCourseRun,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCourseRunPage);
