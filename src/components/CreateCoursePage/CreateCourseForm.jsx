import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import store from '../../data/store';
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
    } = this.props;

    return (
      <React.Fragment>
        <div className="create-course-form row">
          <div className="col">
            <form onSubmit={handleSubmit}>
              <Field
                name="courseOrg"
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
                name="courseTitle"
                component={RenderInputTextField}
                type="text"
                label={
                  <React.Fragment>
                    Course title
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <Field
                name="courseNumber"
                component={RenderInputTextField}
                type="text"
                label={
                  <React.Fragment>
                    Course number
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <Field
                name="courseEnrollmentTrack"
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
                name="coursePrice"
                component={RenderInputTextField}
                type="number"
                label={
                  <React.Fragment>
                    Course price (USD)
                    <span className="required">*</span>
                  </React.Fragment>
                }
                required
              />
              <div className="row justify-content-end">
                <Link
                  className={['btn btn-link ml-3 form-cancel-btn']}
                  to="/"
                  disabled={pristine || submitting}
                  onClick={() => {
                    store.dispatch(push('/'));
                  }}
                >
                  Cancel
                </Link>
                <button type="submit" className="form-submit-btn" disabled={pristine || submitting}>
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

CreateCourseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    courseOrg: PropTypes.string,
    courseTitle: PropTypes.string,
    courseNumber: PropTypes.string,
    courseEnrollmentTrack: PropTypes.string,
    coursePrice: PropTypes.number,
  }).isRequired,
  organizations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  })).isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'create-course-form' })(CreateCourseForm);

