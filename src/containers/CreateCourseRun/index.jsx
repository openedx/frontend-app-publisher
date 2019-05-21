import { connect } from 'react-redux';

import CreateCourseRunPage from '../../components/CreateCourseRunPage';
import {
  createCourseRun,
  fetchCourseInfo,
  clearCourseInfoErrors,
} from '../../data/actions/courseInfo';

const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
});

const mapDispatchToProps = {
  fetchCourseInfo,
  createCourseRun,
  clearCourseInfoErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCourseRunPage);
