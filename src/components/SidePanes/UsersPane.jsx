import React from 'react';
import PropTypes from 'prop-types';

import Select, { components } from 'react-select';
import ReactTooltip from 'react-tooltip';

import { Icon, Alert } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';

import Pane from './Pane';
import User from './User';

import './UsersPane.scss';

// customize react-select dropdown options to show tooltips
const Option = (props) => (
  <div className={`tooltip-${props.data.value}`} data-tip data-for={`tooltip-${props.data.value}`}>
    <components.Option {...props} className={`option-${props.data.value}`} />
    <ReactTooltip id={`tooltip-${props.data.value}`}>
      <span>{props.data.label}</span>
    </ReactTooltip>
  </div>
);

class UsersPane extends React.Component {
  displayName(user) {
    if (user.email) {
      return `${user.full_name} (${user.email})`;
    }
    return user.full_name;
  }

  constructor(props) {
    super(props);
    this.state = {
      addingUser: false,
      newEditorChoice: 0,
    };
    this.selectRef = React.createRef();

    this.addUser = this.addUser.bind(this);
    this.resetEditorChoice = this.resetEditorChoice.bind(this);
    this.startAddingUser = this.startAddingUser.bind(this);
    this.editorChoiceChanged = this.editorChoiceChanged.bind(this);
  }

  componentDidMount() {
    this.props.fetchCourseEditors();
    if (this.props.fetchOrganizationRoles) {
      this.props.fetchOrganizationRoles('project_coordinator');
    }
    if (this.props.fetchOrganizationUsers) {
      this.props.fetchOrganizationUsers();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.fetchOrganizationRoles && this.props.fetchOrganizationRoles) {
      this.props.fetchOrganizationRoles('project_coordinator');
    }
    if (!prevProps.fetchOrganizationUsers && this.props.fetchOrganizationUsers) {
      this.props.fetchOrganizationUsers();
    }
  }

  addUser() {
    if (this.selectRef.current.state.value) {
      this.props.addCourseEditor(this.state.newEditorChoice);
      this.resetEditorChoice();
    }
  }

  resetEditorChoice() {
    this.setState({
      addingUser: false,
      newEditorChoice: 0,
    });
  }

  startAddingUser() {
    this.setState({
      addingUser: true,
      newEditorChoice: this.editorChoices()[0].id,
    });
  }

  editorChoices() {
    const {
      courseEditors,
      organizationUsers,
    } = this.props;
    const editorIds = new Set(courseEditors.data.map(editor => editor.user.id));
    return organizationUsers.data.filter(user => !editorIds.has(user.id));
  }

  editorChoiceChanged(e) {
    this.setState({
      newEditorChoice: e.value,
    });
  }

  render() {
    const {
      addCourseEditor,
      courseEditors,
      organizationRoles,
      organizationUsers,
      removeCourseEditor,
    } = this.props;
    const {
      addingUser,
    } = this.state;

    const editorChoices = this.editorChoices();
    const hasEditor = courseEditors.data.length > 0;
    const showSpinner = courseEditors.isFetching || organizationRoles.isFetching;
    const showPCs = !showSpinner && !organizationRoles.error && organizationRoles.data.length > 0;
    const showEditors = !showSpinner && !courseEditors.error && !organizationUsers.error;
    const showAddButton = addCourseEditor && !addingUser && !organizationUsers.isFetching
      && editorChoices.length > 0;

    return (
      <Pane title="Users">
        {showSpinner
          && <Icon className="fa fa-circle-o-notch fa-spin fa-fw" />}
        {showPCs
          && (
          <div className="mb-2">
            <div className="font-weight-bold text-dark-700 mb-2">Project coordinators</div>
            {organizationRoles.data.map(role => (
              <User
                key={role.id}
                userId={role.id}
                name={role.user.full_name}
                email={role.user.email}
              />
            ))}
          </div>
          )}
        {!showEditors && Array.isArray(organizationUsers.error) && organizationUsers.error.length
          && <Alert variant="warning">{organizationUsers.error[0]}</Alert>}
        {showEditors
          && (
          <div>
            <div className="font-weight-bold text-dark-700 mb-2">Course editors</div>
            {courseEditors.data.map(editor => (
              <User
                key={editor.id}
                userId={editor.id}
                name={editor.user.full_name}
                email={editor.user.email}
                onRemove={removeCourseEditor}
              />
            ))}
            {hasEditor
              || <div>All team members</div>}
            {showAddButton
              && (
              <button type="button" className="btn btn-link text-dark-900 p-0 usersPane-startAdd" onClick={this.startAddingUser}>
                <Add /> {hasEditor ? 'Add editor' : 'Set editor'}
              </button>
              )}
            {addingUser
              && (
              <div className="mt-2">
                <hr />
                <div className="font-weight-bold text-dark-700 mb-2">Select an editor:</div>
                <Select
                  name="add_editor"
                  className="select-container"
                  classNamePrefix="react-select-pane"
                  placeholder="Search..."
                  ref={this.selectRef}
                  components={{
                    IndicatorSeparator: () => null,
                    Option,
                  }}
                  options={
                    editorChoices.map(user => ({
                      label: this.displayName(user),
                      value: user.id,
                    }))
                  }
                  onChange={this.editorChoiceChanged}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm align-baseline ml-1 usersPane-add"
                  onClick={this.addUser}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm align-baseline ml-1 usersPane-cancel"
                  onClick={this.resetEditorChoice}
                >
                  Cancel
                </button>
              </div>
              )}
          </div>
          )}
      </Pane>
    );
  }
}

Option.defaultProps = {
  className: '',
};

Option.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

UsersPane.defaultProps = {
  addCourseEditor: null,
  courseEditors: {
    data: [],
    error: null,
    isFetching: false,
  },
  fetchCourseEditors: () => null,
  fetchOrganizationRoles: null,
  fetchOrganizationUsers: null,
  organizationRoles: {
    data: [],
    error: null,
    isFetching: false,
  },
  organizationUsers: {
    data: [],
    error: null,
    isFetching: false,
  },
  removeCourseEditor: null,
};

UsersPane.propTypes = {
  addCourseEditor: PropTypes.func,
  courseEditors: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({})),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  fetchCourseEditors: PropTypes.func,
  fetchOrganizationRoles: PropTypes.func,
  fetchOrganizationUsers: PropTypes.func,
  organizationRoles: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({})),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  organizationUsers: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({})),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  removeCourseEditor: PropTypes.func,
};

export default UsersPane;
