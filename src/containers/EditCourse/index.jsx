import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import EditCoursePage from '../../components/EditCoursePage';
import { updateFormValuesAfterSave, editCourse, fetchCourseInfo, clearCreateStatusAlert } from '../../data/actions/courseInfo';
import { clearSubmitStatus, clearCourseReviewAlert } from '../../data/actions/courseSubmitInfo';
import { addCourseEditor, fetchCourseEditors, removeCourseEditor } from '../../data/actions/courseEditors';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';
import { fetchOrganizationUsers } from '../../data/actions/organizationUsers';


const mapStateToProps = state => ({
  authentication: state.authentication,
  courseEditors: state.courseEditors,
  courseInfo: state.courseInfo,
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
  courseSubmitInfo: state.courseSubmitInfo,
  organizationUsers: state.organizationUsers,
  sourceInfo: state.sourceInfo,
  stafferInfo: state.stafferInfo,
  formValues: formId => getFormValues(formId)(state),
});

const mapDispatchToProps = {
  addCourseEditor,
  fetchCourseEditors,
  fetchCourseInfo,
  fetchCourseOptions,
  fetchCourseRunOptions,
  fetchOrganizationUsers,
  editCourse,
  clearSubmitStatus,
  clearCourseReviewAlert,
  clearCreateStatusAlert,
  removeCourseEditor,
  updateFormValuesAfterSave,
};

const mergeProps = (stateProps, actionProps, { id }) => ({
  ...stateProps,
  ...actionProps,
  addCourseEditor: userId => actionProps.addCourseEditor(id, userId),
  fetchCourseEditors: () => actionProps.fetchCourseEditors(id),
  fetchCourseInfo: () => actionProps.fetchCourseInfo(id),
  fetchCourseOptions: () => actionProps.fetchCourseOptions(),
  fetchCourseRunOptions: () => actionProps.fetchCourseRunOptions(),
  editCourse: (courseData, courseRunData, submittingRunForReview) => (
    actionProps.editCourse(courseData, courseRunData, submittingRunForReview)),
  clearSubmitStatus: () => (actionProps.clearSubmitStatus()),
  clearCourseReviewAlert: () => (actionProps.clearCourseReviewAlert()),
  clearCreateStatusAlert: () => (actionProps.clearCreateStatusAlert()),
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
