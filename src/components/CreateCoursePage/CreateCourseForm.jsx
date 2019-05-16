import moment from 'moment';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import ActionButton from '../ActionButton';
import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';

import {
  AUDIT_TRACK,
  ENTITLEMENT_TRACKS,
  PROFESSIONAL_TRACK,
  VERIFIED_TRACK,
} from '../../data/constants';
import { endDateHelp, enrollmentHelp, startDateHelp, titleHelp } from '../../helpText';
import { getDateString } from '../../utils/index';


class BaseCreateCourseForm extends React.Component {
  getEnrollmentTrackOptions() {
    return [
      { label: 'Select enrollment track', value: '' },
      { label: VERIFIED_TRACK.name, value: VERIFIED_TRACK.key },
      { label: AUDIT_TRACK.name, value: AUDIT_TRACK.key },
      { label: PROFESSIONAL_TRACK.name, value: PROFESSIONAL_TRACK.key },
    ];
  }

  processOrganizations(organizations) {
    const orgSelectList = [{ label: 'Select organization', value: '' }];

    if (organizations) {
      organizations.forEach((org) => {
        orgSelectList.push({ label: org.name, value: org.key });
      });
    }
    return orgSelectList;
  }

  render() {
    const {
      currentValues,
      handleSubmit,
      organizations,
      pristine,
      isCreating,
    } = this.props;
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
          {ENTITLEMENT_TRACKS.includes(currentValues.enrollmentTrack) && <Field
            name="price"
            component={RenderInputTextField}
            extraInput={{
              min: 0.01,
              step: 0.01,
            }}
            type="number"
            label={<FieldLabel text="Price (USD)" required />}
            required
          />}
          <h2>First run of your Course</h2>
          <hr />
          <Field
            name="start"
            type="date"
            component={RenderInputTextField}
            format={value => getDateString(value)}
            normalize={value => moment.utc(value).toISOString()}
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
            normalize={value => moment.utc(value).toISOString()}
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
          <ButtonToolbar>
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
  currentValues: {},
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
  currentValues: PropTypes.shape({}),
  organizations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  })).isRequired,
  pristine: PropTypes.bool,
  isCreating: PropTypes.bool,
};

export default reduxForm({
  form: 'create-course-form',
})(BaseCreateCourseForm);
export { BaseCreateCourseForm };
