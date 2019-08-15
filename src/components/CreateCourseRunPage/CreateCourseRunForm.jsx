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
import { getDateWithDashes, isSafari, localTimeZone } from '../../utils';
import { DATE_INPUT_PATTERN } from '../../data/constants';

const BaseCreateCourseRunForm = ({
  handleSubmit,
  pristine,
  isCreating,
  title,
  uuid,
  getCourseRunOptions,
  parseOptions,
  currentFormValues,
  courseRunLabels,
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
          name="rerun"
          type="text"
          component={RenderSelectField}
          options={courseRunLabels}
          label={
            <FieldLabel
              id="rerun.label"
              text="Select a run to copy"
              helpText={
                <div>
                  <p>
                    Select a run to copy as the starting point for your new studio instance.
                    The newest run is listed first.
                  </p>
                </div>
              }
            />
          }
        />
        {/* TODO this should be refactored when paragon supports safari */}
        {/* text inputs for safari */}
        {isSafari ?
          <div>
            <Field
              name="start"
              type="text"
              component={DateTimeField}
              dateLabel="Start date"
              timeLabel={`Start time (${localTimeZone})`}
              helpText={startDateHelp}
              required
              maxLength="10"
              pattern={DATE_INPUT_PATTERN}
              placeholder="yyyy/mm/dd"
            />
            <Field
              name="end"
              type="text"
              component={DateTimeField}
              dateLabel="End date"
              timeLabel={`End time (${localTimeZone})`}
              helpText={endDateHelp}
              required
              maxLength="10"
              pattern={DATE_INPUT_PATTERN}
              placeholder="yyyy/mm/dd"
            />
          </div> :
          // date inputs for all browsers besides safari
          <div>
            <Field
              name="start"
              type="date"
              component={DateTimeField}
              dateLabel="Start date"
              timeLabel={`Start time (${localTimeZone})`}
              helpText={startDateHelp}
              required
              minDate={getDateWithDashes(moment())}
            />
            <Field
              name="end"
              type="date"
              component={DateTimeField}
              dateLabel="End date"
              timeLabel={`End time (${localTimeZone})`}
              helpText={endDateHelp}
              required
              minDate={getDateWithDashes(moment(currentFormValues.start).add(1, 'd') || moment())}
            />
          </div>
        }
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
  courseRunLabels: [],
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
  courseRunLabels: PropTypes.arrayOf(PropTypes.shape({})),
};

const CreateCourseRunForm = reduxForm({
  form: 'create-course-run-form',
})(BaseCreateCourseRunForm);
export { BaseCreateCourseRunForm, CreateCourseRunForm };
