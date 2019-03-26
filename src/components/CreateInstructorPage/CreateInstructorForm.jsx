import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';

import AreasOfExpertise from './AreasOfExpertise';
import SocialLinks from './SocialLinks';
import ImageUpload from '../../components/ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RichEditor from '../../components/RichEditor';
import store from '../../data/store';


const basicValidate = value => (value ? undefined : 'This field is required');

const extractOrgChoices = (instructorOptions) => {
  const { data = {} } = instructorOptions;

  if (!data.actions) {
    return [];
  }

  const { choices = [] } = data.actions.POST.position.children.organization;

  const defaultOption = [{ label: 'Select instructor organization', value: '' }];
  return defaultOption.concat(choices
    .map(choice => ({ label: choice.display_name, value: choice.value })));
};

const BaseCreateInstructorForm = ({
  handleSubmit,
  pristine,
  submitting,
  isCreating,
  instructorOptions,
}) => {
  const formControlDisabled = pristine || submitting || isCreating;

  return (
    <React.Fragment>
      <div className="create-instructor-form row">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <Field
              name="image"
              component={ImageUpload}
              label={
                <React.Fragment>
                  Image:
                  <span className="required" aria-hidden>*</span>
                </React.Fragment>
              }
              id="image"
              required
            />
            <Field
              name="firstName"
              component={RenderInputTextField}
              type="text"
              label={
                <React.Fragment>
                  First name
                  <span className="required" aria-hidden>*</span>
                </React.Fragment>
              }
              required
            />
            <Field
              name="lastName"
              component={RenderInputTextField}
              type="text"
              label={
                <React.Fragment>
                  Last name
                  <span className="required" aria-hidden>*</span>
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
                  Position
                  <span className="required" aria-hidden>*</span>
                </React.Fragment>
              }
              required
            />
            <Field
              name="organization"
              component={RenderSelectField}
              options={extractOrgChoices(instructorOptions)}
              label={
                <React.Fragment>
                  Organization
                  <span className="required" aria-hidden>*</span>
                </React.Fragment>
              }
              required
            />
            <Field
              name="bio"
              component={RichEditor}
              label={
                <React.Fragment>
                  Biography
                  <span className="required" aria-hidden>*</span>
                </React.Fragment>
              }
              maxChars={250}
              validate={basicValidate}
              id="bio"
            />
            <Field
              name="majorWorks"
              component={RichEditor}
              label={
                <React.Fragment>
                  Major works (optional)
                </React.Fragment>
              }
              maxChars={250}
              id="works"
            />
            <FieldArray
              name="socialLinks"
              component={SocialLinks}
            />
            <FieldArray
              name="areasOfExpertise"
              component={AreasOfExpertise}
            />
            <div className="row justify-content-end">
              <Link
                className={['btn btn-link ml-3 form-cancel-btn']}
                to="/"
                disabled={formControlDisabled}
                onClick={() => {
                  store.dispatch(push('/'));
                }}
              >
                Cancel
              </Link>
              <button type="submit" className="btn btn-outline-primary form-submit-btn" disabled={formControlDisabled} >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

BaseCreateInstructorForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  instructorOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  isCreating: PropTypes.bool,
};

BaseCreateInstructorForm.defaultProps = {
  instructorOptions: {},
  isCreating: false,
};

const CreateInstructorForm = reduxForm({ form: 'create-instructor-form' })(BaseCreateInstructorForm);
export { basicValidate, extractOrgChoices, BaseCreateInstructorForm, CreateInstructorForm };
