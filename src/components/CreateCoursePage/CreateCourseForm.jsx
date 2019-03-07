import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import { AUDIT_TRACK, VERIFIED_TRACK, PROFESSIONAL_TRACK } from '../../data/constants';

class CreateCourseForm extends React.Component {
  getEnrollmentTrackOptions() {
    return [
      { label: 'Select enrollment track', value: '' },
      { label: VERIFIED_TRACK.name, value: VERIFIED_TRACK.key },
      { label: AUDIT_TRACK.name, value: AUDIT_TRACK.key },
      { label: PROFESSIONAL_TRACK.name, value: PROFESSIONAL_TRACK.key },
    ];
  }

  processOrganizations(organizations) {
    const orgSelectList = [{ label: 'Select user organization', value: '' }];

    if (organizations) {
      organizations.forEach((org) => {
        orgSelectList.push({ label: org.name, value: org.key });
      });
    }
    return orgSelectList;
  }

  render() {
    const {
      handleSubmit,
      organizations,
      pristine,
      submitting,
      isCreating,
    } = this.props;
    return (
      <React.Fragment>
        <div className="create-course-form row">
          <div className="col">
            <h3>Course</h3>
            <hr />
            <form onSubmit={handleSubmit}>
              <Field
                name="org"
                component={RenderSelectField}
                options={this.processOrganizations(organizations)}
                label={
                  <React.Fragment>
                    Organization
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <Field
                name="title"
                component={RenderInputTextField}
                type="text"
                label={
                  <React.Fragment>
                    Title
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <Field
                name="number"
                component={RenderInputTextField}
                type="text"
                label={
                  <React.Fragment>
                    Number
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <Field
                name="enrollmentTrack"
                component={RenderSelectField}
                options={this.getEnrollmentTrackOptions()}
                label={
                  <React.Fragment>
                    Enrollment track
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <Field
                name="price"
                component={RenderInputTextField}
                type="number"
                label={
                  <React.Fragment>
                    Price (USD)
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <h3>First run of your Course</h3>
              <hr />
              <Field
                name="start"
                type="date"
                component={RenderInputTextField}
                label={
                  <React.Fragment>
                    Start date
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
                    End date
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <div className="row justify-content-end">
                <button
                  type="submit"
                  className="btn btn-outline-primary form-submit-btn"
                  disabled={pristine || submitting || isCreating}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

CreateCourseForm.defaultProps = {
  isCreating: false,
};

CreateCourseForm.propTypes = {
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
  organizations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  })).isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool,
};

export default reduxForm({
  form: 'create-course-form',
})(CreateCourseForm);

