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
        fetchOrganizationUsers={props.fetchOrganizationUsers}
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
  fetchOrganizationUsers: () => null,
  hidden: false,
  organizationUsers: {},
  removeCourseEditor: () => null,
};

SidePanes.propTypes = {
  addCourseEditor: PropTypes.func,
  className: PropTypes.string,
  courseEditors: PropTypes.shape(),
  fetchCourseEditors: PropTypes.func,
  fetchOrganizationUsers: PropTypes.func,
  hidden: PropTypes.bool,
  organizationUsers: PropTypes.shape(),
  removeCourseEditor: PropTypes.func,
};

export default SidePanes;
