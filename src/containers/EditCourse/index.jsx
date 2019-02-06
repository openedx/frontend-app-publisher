import { connect } from 'react-redux';

import EditCoursePage from '../../components/EditCoursePage';
import { editCourse, fetchCourseInfo } from '../../data/actions/courseInfo';
import { fetchCourseOptions } from '../../data/actions/courseOptions';


const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
  courseOptions: state.courseOptions,
});

const mapDispatchToProps = {
  fetchCourseInfo,
  fetchCourseOptions,
  editCourse,
};

const mergeProps = (stateProps, actionProps, { id }) => ({
  ...stateProps,
  fetchCourseInfo: () => actionProps.fetchCourseInfo(id),
  fetchCourseOptions: () => actionProps.fetchCourseOptions(id),
  editCourse: courseData => actionProps.editCourse(courseData),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(EditCoursePage);
