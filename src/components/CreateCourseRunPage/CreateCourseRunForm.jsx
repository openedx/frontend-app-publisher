import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RenderInputTextField from '../RenderInputTextField';

const BaseCreateCourseRunForm = ({
  handleSubmit,
  pristine,
  submitting,
  title,
  uuid,
}) => {
  const formControlDisabled = pristine || submitting;
  return (
    <React.Fragment>
      <div className="create-course-run-form row">
        <div className="col">
          <h2>Create a new course run</h2>
          <hr />
          <div className="row">
            <div id="course" className="col-12">
              <strong>Course</strong>
            </div>
            <div className="col-12">
              <Link to={`/courses/${uuid}/edit/`}>
                {title}
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <Field
              name="start"
              type="date"
              component={RenderInputTextField}
              label={
                <React.Fragment>
                  <strong>Start date</strong>
                  <span className="required">*</span>
                </React.Fragment>
              }
              required
            />
            <Field
              name="end"
              type="date"
              component={RenderInputTextField}
              label={
                <React.Fragment>
                  <strong>End date</strong>
                  <span className="required">*</span>
                </React.Fragment>
              }
              required
            />
            <div className="row justify-content-end">
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

            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
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
