import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import CreateCoursePage from '../../components/CreateCoursePage';
import { fetchOrganizations } from '../../data/actions/publisherUserInfo';
import { createCourse, clearCourseInfoErrors } from '../../data/actions/courseInfo';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';

const mapStateToProps = (state, props) => ({
  publisherUserInfo: state.publisherUserInfo,
  courseInfo: state.courseInfo,
  initialValues: props.initialValues,
  formValues: getFormValues('create-course-form')(state),
  courseRunOptions: state.courseRunOptions,
});

const mapDispatchToProps = {
  createCourse,
  fetchOrganizations,
  fetchCourseRunOptions,
  clearCourseInfoErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCoursePage);
