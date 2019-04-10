import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RenderInputTextField from '../RenderInputTextField';
import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';

const BaseCreateCourseRunForm = ({
  handleSubmit,
  pristine,
  submitting,
  title,
  uuid,
}) => {
  const formControlDisabled = pristine || submitting;
  return (
    <div className="create-course-run-form">
      <h2>Create a new course run</h2>
      <hr />
      <FieldLabel text="Course" className="mb-2" />
      <div className="mb-3">
        <Link to={`/courses/${uuid}/edit/`}>
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
          <Link to={`/courses/${uuid}/edit/`}>
            <button
              className="btn btn-outline-primary"
              disabled={submitting}
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="btn btn-primary form-submit-btn"
            disabled={formControlDisabled}
          >
            Submit
          </button>
        </ButtonToolbar>
      </form>
    </div>
  );
};

BaseCreateCourseRunForm.defaultProps = {
};

BaseCreateCourseRunForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

const CreateCourseRunForm = reduxForm({
  form: 'create-course-run-form',
})(BaseCreateCourseRunForm);
export { BaseCreateCourseRunForm, CreateCourseRunForm };
