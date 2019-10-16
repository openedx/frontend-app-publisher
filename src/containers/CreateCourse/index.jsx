import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import CreateCoursePage from '../../components/CreateCoursePage';
import { fetchOrganizations } from '../../data/actions/publisherUserInfo';
import { createCourse, clearCourseInfoErrors, clearCreateCourseStatus } from '../../data/actions/courseInfo';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';

const mapStateToProps = (state, props) => ({
  publisherUserInfo: state.publisherUserInfo,
  courseInfo: state.courseInfo,
  initialValues: props.initialValues,
  formValues: getFormValues('create-course-form')(state),
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
  clearCreateCourseStatus: props.clearCreateCourseStatus,
});

const mapDispatchToProps = {
  createCourse,
  fetchOrganizations,
  fetchCourseOptions,
  fetchCourseRunOptions,
  clearCourseInfoErrors,
  clearCreateCourseStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCoursePage);
