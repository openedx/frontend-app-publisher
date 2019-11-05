import moment from 'moment';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import ActionButton from '../ActionButton';
import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';
import PriceList from '../PriceList';

import {
  AUDIT_TRACK,
  DATE_INPUT_PATTERN,
  ENTITLEMENT_TRACKS,
  PROFESSIONAL_TRACK,
  VERIFIED_TRACK,
} from '../../data/constants';
import { endDateHelp, enrollmentHelp, pacingHelp, startDateHelp, titleHelp, typeHelp } from '../../helpText';
import DateTimeField from '../DateTimeField';
import { isSafari, localTimeZone, getDateWithDashes, getOptionsData, parseCourseTypeOptions, parseOptions } from '../../utils';

class BaseCreateCourseForm extends React.Component {
  // DISCO-1399: Can remove this function since we will get it from the Course Type OPTIONS
  getEnrollmentTrackOptions() {
    return [
      { label: 'Select enrollment track', value: '' },
      { label: VERIFIED_TRACK.name, value: VERIFIED_TRACK.key },
      { label: AUDIT_TRACK.name, value: AUDIT_TRACK.key },
      { label: PROFESSIONAL_TRACK.name, value: PROFESSIONAL_TRACK.key },
    ];
  }

  processOrganizations(organizations) {
    let orgSelectList = [{ label: 'Select organization', value: '' }];

    if (organizations) {
      const newOrgs = organizations.map(org => ({ label: org.name, value: org.key }));
      orgSelectList = orgSelectList.concat(newOrgs);
    }

    return orgSelectList;
  }

  render() {
    const {
      currentFormValues,
      handleSubmit,
      organizations,
      pristine,
      isCreating,
      // DISCO-1399: remove usingCourseType
      usingCourseType,
      courseOptions,
      courseRunOptions,
    } = this.props;
    const courseOptionsData = getOptionsData(courseOptions);
    const parsedTypeOptions = courseOptionsData &&
      parseCourseTypeOptions(courseOptionsData.type.type_options);
    const { courseTypeOptions } = parsedTypeOptions;
    const { courseRunTypeOptions } = parsedTypeOptions;
    const { priceLabels } = parsedTypeOptions;
    const courseRunOptionsData = getOptionsData(courseRunOptions);
    const { pacing_type: { choices } } = courseRunOptionsData;
    const pacingTypeOptions = courseRunOptionsData && parseOptions(choices);

    return (
      <div className="create-course-form">
        <h2>Create New Course</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <Field
            name="org"
            component={RenderSelectField}
            options={this.processOrganizations(organizations)}
            label={<FieldLabel text="Organization" required />}
            required
          />
          <Field
            name="title"
            component={RenderInputTextField}
            type="text"
            label={
              <FieldLabel
                id="title-label"
                text="Title"
                required
                helpText={titleHelp}
              />
            }
            required
          />
          <Field
            name="number"
            component={RenderInputTextField}
            type="text"
            label={
              <FieldLabel
                id="number-label"
                text="Number"
                required
                extraText="Cannot edit after submission"
                helpText={
                  <div>
                    <p>
                      Maximum 10 characters. Characters can be letters, numbers, periods,
                      underscores, or hyphens.
                    </p>
                    <p>
                      If a course consists of several modules, the course number can have an
                      ending such as .1x or .2x.
                    </p>
                    <p>
                      <a
                        href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/title_number_guidelines.html#course-number-guidelines"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more.
                      </a>
                    </p>
                    <p><b>Examples:</b></p>
                    <ol>
                      <li>CS002x</li>
                      <li>BIO1.1x, BIO1.2x</li>
                    </ol>
                  </div>
                }
              />
            }
            required
          />
          {// DISCO-1399: We don't need this ternary operator anymore. Just show the Course Type
          }
          {usingCourseType ? (
            <React.Fragment>
              <Field
                name="type"
                component={RenderSelectField}
                options={courseTypeOptions}
                label={
                  <FieldLabel
                    id="course-type-label"
                    text="Course enrollment track"
                    required
                    helpText={typeHelp}
                  />
                }
                required
              />
              <PriceList
                priceLabels={currentFormValues.type ? priceLabels[currentFormValues.type] : {}}
                required
              />
            </React.Fragment>) : (
              <React.Fragment>
                <Field
                  name="enrollmentTrack"
                  component={RenderSelectField}
                  options={this.getEnrollmentTrackOptions()}
                  label={
                    <FieldLabel
                      id="enrollment-track-label"
                      text="Enrollment track"
                      required
                      helpText={enrollmentHelp}
                    />
                  }
                  required
                />
                {ENTITLEMENT_TRACKS.includes(currentFormValues.enrollmentTrack) &&
                  <Field
                    name="price"
                    component={RenderInputTextField}
                    extraInput={{
                      min: 1.00,
                      step: 0.01,
                      max: 10000.00,
                    }}
                    type="number"
                    label={<FieldLabel text="Price (USD)" required />}
                    required
                  />
                }
              </React.Fragment>)
          }
          <h2>First run of your Course</h2>
          <hr />
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
          {// DISCO-1399: We don't need this ternary operator anymore. Just show the Run Type
          }
          {usingCourseType &&
            <Field
              name="run_type"
              component={RenderSelectField}
              options={currentFormValues.type ? courseRunTypeOptions[currentFormValues.type] : [{ label: 'Select Course enrollment track first', value: '' }]}
              label={
                <FieldLabel
                  id="course-run-type-label"
                  text="Course run enrollment track"
                  required
                  helpText={enrollmentHelp}
                />
              }
              required
            />
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
            <Link to="/">
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
  }
}

BaseCreateCourseForm.defaultProps = {
  isCreating: false,
  pristine: true,
  currentFormValues: {},
  usingCourseType: false,
};

BaseCreateCourseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    org: PropTypes.string,
    title: PropTypes.string,
    number: PropTypes.string,
    enrollmentTrack: PropTypes.string,
    price: PropTypes.number,
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
  currentFormValues: PropTypes.shape({}),
  organizations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  })).isRequired,
  pristine: PropTypes.bool,
  isCreating: PropTypes.bool,
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  usingCourseType: PropTypes.bool,
};

export default reduxForm({
  form: 'create-course-form',
})(BaseCreateCourseForm);
export { BaseCreateCourseForm };
