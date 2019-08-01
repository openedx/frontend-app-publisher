import React from 'react';
import PropTypes from 'prop-types';

import UsersPane from './UsersPane';
import CommentsPane from './CommentsPane';

function SidePanes(props) {
  return (
    <div className={props.className} hidden={props.hidden}>
      <UsersPane
        addCourseEditor={props.addCourseEditor}
        courseEditors={props.courseEditors}
        fetchCourseEditors={props.fetchCourseEditors}
        fetchOrganizationRoles={props.fetchOrganizationRoles}
        fetchOrganizationUsers={props.fetchOrganizationUsers}
        organizationRoles={props.organizationRoles}
        organizationUsers={props.organizationUsers}
        removeCourseEditor={props.removeCourseEditor}
      />
      <CommentsPane
        addComment={props.addComment}
        comments={props.comments}
        fetchComments={props.fetchComments}
        courseUuid={props.courseUuid}
      />
    </div>
  );
}

SidePanes.defaultProps = {
  addComment: () => null,
  addCourseEditor: () => null,
  className: '',
  comments: {},
  courseEditors: {},
  courseUuid: '',
  fetchComments: () => null,
  fetchCourseEditors: () => null,
  fetchOrganizationRoles: null,
  fetchOrganizationUsers: null,
  hidden: false,
  organizationRoles: {},
  organizationUsers: {},
  removeCourseEditor: () => null,
};

SidePanes.propTypes = {
  addComment: PropTypes.func,
  addCourseEditor: PropTypes.func,
  className: PropTypes.string,
  comments: PropTypes.shape(),
  courseEditors: PropTypes.shape(),
  courseUuid: PropTypes.string,
  fetchComments: PropTypes.func,
  fetchCourseEditors: PropTypes.func,
  fetchOrganizationRoles: PropTypes.func,
  fetchOrganizationUsers: PropTypes.func,
  hidden: PropTypes.bool,
  organizationRoles: PropTypes.shape(),
  organizationUsers: PropTypes.shape(),
  removeCourseEditor: PropTypes.func,
};

export default SidePanes;
