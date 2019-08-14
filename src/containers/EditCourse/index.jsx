import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import EditCoursePage from '../../components/EditCoursePage';
import { updateFormValuesAfterSave, editCourse, fetchCourseInfo, clearCreateStatusAlert } from '../../data/actions/courseInfo';
import { clearSubmitStatus, clearCourseReviewAlert } from '../../data/actions/courseSubmitInfo';
import { addCourseEditor, fetchCourseEditors, removeCourseEditor } from '../../data/actions/courseEditors';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';
import { fetchOrganizationRoles } from '../../data/actions/organizationRoles';
import { fetchOrganizationUsers } from '../../data/actions/organizationUsers';


const mapStateToProps = state => ({
  authentication: state.authentication,
  courseEditors: state.courseEditors,
  courseInfo: state.courseInfo,
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
  courseSubmitInfo: state.courseSubmitInfo,
  organizationRoles: state.organizationRoles,
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
  fetchOrganizationRoles,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(EditCoursePage);
