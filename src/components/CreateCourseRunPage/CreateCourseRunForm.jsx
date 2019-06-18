import moment from 'moment';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RenderInputTextField from '../RenderInputTextField';
import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';
import ActionButton from '../ActionButton';

import { DATE_FORMAT } from '../../data/constants';
import { endDateHelp, startDateHelp, pacingHelp } from '../../helpText';
import { getDateString } from '../../utils/index';
import RenderSelectField from '../RenderSelectField';

const BaseCreateCourseRunForm = ({
  handleSubmit,
  pristine,
  isCreating,
  title,
  uuid,
  getCourseRunOptions,
  parseOptions,
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
          type="date"
          component={RenderInputTextField}
          format={value => getDateString(value)}
          normalize={value => moment.utc(value).format(DATE_FORMAT)}
          label={
            <FieldLabel
              id="start-label"
              text="Start date"
              required
              helpText={startDateHelp}
            />
          }
          placeholder="mm/dd/yyyy"
          required
        />
        <Field
          name="end"
          type="date"
          component={RenderInputTextField}
          format={value => getDateString(value)}
          normalize={value => moment.utc(value).format(DATE_FORMAT)}
          label={
            <FieldLabel
              id="end-label"
              text="End date"
              required
              helpText={endDateHelp}
            />
          }
          placeholder="mm/dd/yyyy"
          required
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
};

BaseCreateCourseRunForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  getCourseRunOptions: PropTypes.func.isRequired,
  parseOptions: PropTypes.func.isRequired,
};

const CreateCourseRunForm = reduxForm({
  form: 'create-course-run-form',
})(BaseCreateCourseRunForm);
export { BaseCreateCourseRunForm, CreateCourseRunForm };
