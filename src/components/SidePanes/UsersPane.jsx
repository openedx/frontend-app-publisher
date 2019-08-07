import React from 'react';
import PropTypes from 'prop-types';

import { Icon, InputSelect } from '@edx/paragon';

import Pane from './Pane';
import User from './User';
import FieldLabel from '../FieldLabel';


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

    this.addUser = this.addUser.bind(this);
    this.resetEditorChoice = this.resetEditorChoice.bind(this);
    this.startAddingUser = this.startAddingUser.bind(this);
    this.editorChoiceChanged = this.editorChoiceChanged.bind(this);
  }

  componentDidMount() {
    this.props.fetchCourseEditors();
    if (this.props.fetchOrganizationUsers) {
      this.props.fetchOrganizationUsers();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.fetchOrganizationUsers && this.props.fetchOrganizationUsers) {
      this.props.fetchOrganizationUsers();
    }
  }

  addUser() {
    this.props.addCourseEditor(this.state.newEditorChoice);
    this.resetEditorChoice();
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

  editorChoiceChanged(value) {
    this.setState({
      newEditorChoice: value,
    });
  }

  render() {
    const {
      addCourseEditor,
      courseEditors,
      organizationUsers,
      removeCourseEditor,
    } = this.props;
    const {
      addingUser,
    } = this.state;

    const editorChoices = this.editorChoices();
    const hasEditor = courseEditors.data.length > 0;
    const showSpinner = courseEditors.isFetching;
    const showEditors = !showSpinner && !courseEditors.error && !organizationUsers.error;
    const showAddButton = addCourseEditor && !addingUser && !organizationUsers.isFetching &&
      editorChoices.length > 0;

    return (
      <Pane title="Users">
        {showSpinner &&
          <Icon className="fa fa-circle-o-notch fa-spin fa-fw" />
        }
        {showEditors &&
          <React.Fragment>
            <div className="font-weight-bold">Course Editors</div>
            {courseEditors.data.map(editor => (
              <User
                key={editor.id}
                userId={editor.id}
                name={this.displayName(editor.user)}
                onRemove={removeCourseEditor}
              />
            ))}
            {hasEditor ||
              <div>All team members</div>
            }
            {showAddButton &&
              <button className="btn btn-link p-0 usersPane-startAdd" onClick={this.startAddingUser}>
                <Icon className="fa fa-plus" /> {hasEditor ? 'Add editor' : 'Set editor'}
              </button>
            }
            {addingUser &&
              <div className="mt-2">
                <hr />
                <InputSelect
                  name="add_editor"
                  label={
                    <FieldLabel
                      id="add_editor.label"
                      text="Select an editor:"
                    />
                  }
                  options={
                    editorChoices.map(user => ({ label: this.displayName(user), value: user.id }))
                  }
                  onChange={this.editorChoiceChanged}
                />
                <button
                  className="btn btn-primary btn-sm align-baseline ml-1 usersPane-add"
                  onClick={this.addUser}
                >
                  Add
                </button>
                <button
                  className="btn btn-outline-primary btn-sm align-baseline ml-1 usersPane-cancel"
                  onClick={this.resetEditorChoice}
                >
                  Cancel
                </button>
              </div>
            }
          </React.Fragment>
        }
      </Pane>
    );
  }
}

UsersPane.defaultProps = {
  addCourseEditor: null,
  courseEditors: {
    data: [],
    isFetching: false,
  },
  fetchCourseEditors: () => null,
  fetchOrganizationUsers: null,
  organizationUsers: {
    data: [],
    isFetching: false,
  },
  removeCourseEditor: null,
};

UsersPane.propTypes = {
  addCourseEditor: PropTypes.func,
  courseEditors: PropTypes.shape({
    data: PropTypes.array,
    isFetching: PropTypes.bool,
  }),
  fetchCourseEditors: PropTypes.func,
  fetchOrganizationUsers: PropTypes.func,
  organizationUsers: PropTypes.shape({
    data: PropTypes.array,
    isFetching: PropTypes.bool,
  }),
  removeCourseEditor: PropTypes.func,
};

export default UsersPane;
