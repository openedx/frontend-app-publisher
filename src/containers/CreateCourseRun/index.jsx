import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

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
  formValues: getFormValues('create-course-run-form')(state),
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
