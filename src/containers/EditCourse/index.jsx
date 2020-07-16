import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import EditCoursePage from '../../components/EditCoursePage';
import {
  updateFormValuesAfterSave, editCourse, fetchCourseInfo, clearCreateStatusAlert,
} from '../../data/actions/courseInfo';
import { clearSubmitStatus, clearCourseReviewAlert } from '../../data/actions/courseSubmitInfo';
import { addCourseEditor, fetchCourseEditors, removeCourseEditor } from '../../data/actions/courseEditors';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';
import { fetchOrganizationRoles } from '../../data/actions/organizationRoles';
import { fetchOrganizationUsers } from '../../data/actions/organizationUsers';
import { addComment, fetchComments } from '../../data/actions/comments';
import { fetchCollaboratorOptions } from '../../data/actions/collaboratorOptions';

const mapStateToProps = state => ({
  comments: state.comments,
  courseEditors: state.courseEditors,
  courseInfo: state.courseInfo,
  collaboratorOptions: state.collaboratorOptions,
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
  courseSubmitInfo: state.courseSubmitInfo,
  organizationRoles: state.organizationRoles,
  organizationUsers: state.organizationUsers,
  sourceInfo: state.sourceInfo,
  stafferInfo: state.stafferInfo,
  collaboratorInfo: state.collaboratorInfo,
  formValues: formId => getFormValues(formId)(state),
});

const mapDispatchToProps = {
  addCourseEditor,
  addComment,
  fetchComments,
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
  fetchCollaboratorOptions,
};

const mergeProps = (stateProps, actionProps, { uuid }) => ({
  ...stateProps,
  ...actionProps,
  addCourseEditor: userId => actionProps.addCourseEditor(uuid, userId),
  fetchCourseEditors: () => actionProps.fetchCourseEditors(uuid),
  fetchCourseInfo: () => actionProps.fetchCourseInfo(uuid),
  addComment: comment => actionProps.addComment(comment),
  fetchComments: () => actionProps.fetchComments(uuid),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(EditCoursePage);
