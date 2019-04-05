import { connect } from 'react-redux';

import EditCoursePage from '../../components/EditCoursePage';
import { editCourse, fetchCourseInfo } from '../../data/actions/courseInfo';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';


const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
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
