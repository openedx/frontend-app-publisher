import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RenderInputTextField from '../RenderInputTextField';
import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';
import ActionButton from '../ActionButton';

const BaseCreateCourseRunForm = ({
  handleSubmit,
  pristine,
  isCreating,
  title,
  uuid,
}) => (
  <div className="create-course-run-form">
    <h2>Create a new course run</h2>
    <hr />
    <FieldLabel text="Course" className="mb-2" />
    <div className="mb-3">
      <Link to={`/courses/${uuid}`}>
        {title}
      </Link>
    </div>
    <form onSubmit={handleSubmit}>
      <Field
        name="start"
        type="date"
        component={RenderInputTextField}
        label={<FieldLabel text="Start date" required />}
        required
      />
      <Field
        name="end"
        type="date"
        component={RenderInputTextField}
        label={<FieldLabel text="End date" required />}
        required
      />
      <ButtonToolbar>
        <Link to={`/courses/${uuid}`}>
          <button
            className="btn btn-outline-primary"
            disabled={isCreating}
          >
            Cancel
          </button>
        </Link>
        <ActionButton
          disabled={pristine}
          labels={{
            default: 'Create',
            pending: 'Creating',
          }}
          state={isCreating ? 'pending' : 'default'}
        />
      </ButtonToolbar>
    </form>
  </div>
);

BaseCreateCourseRunForm.defaultProps = {
};

BaseCreateCourseRunForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
};

const CreateCourseRunForm = reduxForm({
  form: 'create-course-run-form',
})(BaseCreateCourseRunForm);
export { BaseCreateCourseRunForm, CreateCourseRunForm };
