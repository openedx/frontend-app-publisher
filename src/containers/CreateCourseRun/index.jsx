import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import CreateCourseRunPage from '../../components/CreateCourseRunPage';
import {
  createCourseRun,
  fetchCourseInfo,
  clearCourseInfoErrors,
} from '../../data/actions/courseInfo';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';

const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
  formValues: getFormValues('create-course-run-form')(state),
});

const mapDispatchToProps = {
  fetchCourseInfo,
  fetchCourseOptions,
  fetchCourseRunOptions,
  createCourseRun,
  clearCourseInfoErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCourseRunPage);
