import moment from 'moment';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';
import ActionButton from '../ActionButton';

import { endDateHelp, startDateHelp, pacingHelp } from '../../helpText';
import RenderSelectField from '../RenderSelectField';
import DateTimeField from '../DateTimeField';
import { getDateString } from '../../utils';

const BaseCreateCourseRunForm = ({
  handleSubmit,
  pristine,
  isCreating,
  title,
  uuid,
  getCourseRunOptions,
  parseOptions,
  currentFormValues,
}) => {
  const courseRunOptions = getCourseRunOptions();
  const { pacing_type: { choices } } = courseRunOptions;
  const pacingTypeOptions = courseRunOptions && parseOptions(choices);
  return (
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
          component={DateTimeField}
          dateLabel="Start date"
          timeLabel="Start time"
          helpText={startDateHelp}
          required
          minDate={getDateString(moment())}
        />
        <Field
          name="end"
          component={DateTimeField}
          dateLabel="End date"
          timeLabel="End time"
          helpText={endDateHelp}
          required
          minDate={getDateString(moment(currentFormValues.start).add(1, 'd') || moment())}
        />
        <Field
          name="pacing_type"
          type="text"
          component={RenderSelectField}
          options={pacingTypeOptions}
          label={
            <FieldLabel
              id="pacing_type.label"
              text="Course pacing"
              helpText={pacingHelp}
            />
          }
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
};

BaseCreateCourseRunForm.defaultProps = {
  currentFormValues: {},
};

BaseCreateCourseRunForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  getCourseRunOptions: PropTypes.func.isRequired,
  parseOptions: PropTypes.func.isRequired,
  currentFormValues: PropTypes.shape({}),
};

const CreateCourseRunForm = reduxForm({
  form: 'create-course-run-form',
})(BaseCreateCourseRunForm);
export { BaseCreateCourseRunForm, CreateCourseRunForm };
