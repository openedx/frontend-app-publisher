import React from 'react';
import PropTypes from 'prop-types';

import UsersPane from './UsersPane';


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
    </div>
  );
}

SidePanes.defaultProps = {
  addCourseEditor: () => null,
  className: '',
  courseEditors: {},
  fetchCourseEditors: () => null,
  fetchOrganizationRoles: null,
  fetchOrganizationUsers: null,
  hidden: false,
  organizationRoles: {},
  organizationUsers: {},
  removeCourseEditor: () => null,
};

SidePanes.propTypes = {
  addCourseEditor: PropTypes.func,
  className: PropTypes.string,
  courseEditors: PropTypes.shape(),
  fetchCourseEditors: PropTypes.func,
  fetchOrganizationRoles: PropTypes.func,
  fetchOrganizationUsers: PropTypes.func,
  hidden: PropTypes.bool,
  organizationRoles: PropTypes.shape(),
  organizationUsers: PropTypes.shape(),
  removeCourseEditor: PropTypes.func,
};

export default SidePanes;
