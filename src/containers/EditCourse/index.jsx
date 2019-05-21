import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import EditCoursePage from '../../components/EditCoursePage';
import { updateFormValuesAfterSave, editCourse, fetchCourseInfo } from '../../data/actions/courseInfo';
import { clearSubmitStatus } from '../../data/actions/courseSubmitInfo';
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
  clearSubmitStatus,
  updateFormValuesAfterSave,
};

const mergeProps = (stateProps, actionProps, { id }) => ({
  ...stateProps,
  fetchCourseInfo: () => actionProps.fetchCourseInfo(id),
  fetchCourseOptions: () => actionProps.fetchCourseOptions(id),
  fetchCourseRunOptions: () => actionProps.fetchCourseRunOptions(),
  editCourse: (courseData, courseRunData, submittingRunForReview) => (
    actionProps.editCourse(courseData, courseRunData, submittingRunForReview)),
  clearSubmitStatus: () => (actionProps.clearSubmitStatus()),
  updateFormValuesAfterSave: (change, currentFormValues, initialImageSrc, initialCourseRuns) => (
    actionProps.updateFormValuesAfterSave(
      change,
      currentFormValues,
      initialImageSrc,
      initialCourseRuns,
    )),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(EditCoursePage);
