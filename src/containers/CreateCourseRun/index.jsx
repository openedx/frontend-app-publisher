import { connect } from 'react-redux';

import CreateCourseRunPage from '../../components/CreateCourseRunPage';
import {
  createCourseRun,
  fetchCourseInfo,
  clearCourseInfoErrors,
} from '../../data/actions/courseInfo';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';

const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
  courseRunOptions: state.courseRunOptions,
});

const mapDispatchToProps = {
  fetchCourseInfo,
  fetchCourseRunOptions,
  createCourseRun,
  clearCourseInfoErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCourseRunPage);
