import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import EditCoursePage from '../../components/EditCoursePage';
import { editCourse, fetchCourseInfo } from '../../data/actions/courseInfo';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';


const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
  stafferInfo: state.stafferInfo,
  sourceInfo: state.sourceInfo,
  courseSubmitInfo: state.courseSubmitInfo,
  formValues: formId => getFormValues(formId)(state),
});

const mapDispatchToProps = {
  fetchCourseInfo,
  fetchCourseOptions,
  fetchCourseRunOptions,
  editCourse,
};

const mergeProps = (stateProps, actionProps, { id }) => ({
  ...stateProps,
  fetchCourseInfo: () => actionProps.fetchCourseInfo(id),
  fetchCourseOptions: () => actionProps.fetchCourseOptions(id),
  fetchCourseRunOptions: () => actionProps.fetchCourseRunOptions(),
  editCourse: (courseData, courseRunData) => (
    actionProps.editCourse(courseData, courseRunData)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(EditCoursePage);
