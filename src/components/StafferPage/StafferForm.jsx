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

const extractOrgChoices = (stafferOptions) => {
  const { data = {} } = stafferOptions;

  if (!data.actions) {
    return [];
  }

  const { choices = [] } = data.actions.POST.position.children.organization;

  const defaultOption = [{ label: 'Select instructor organization', value: '' }];
  return defaultOption.concat(choices
    .map(choice => ({ label: choice.display_name, value: choice.value })));
};

const BaseStafferForm = ({
  handleSubmit,
  pristine,
  submitting,
  isSaving,
  isCreateForm,
  stafferOptions,
}) => {
  const formControlDisabled = pristine || submitting || isSaving;

  return (
    <React.Fragment>
      <div className="create-staffer-form row">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <Field
              name="profile_image.medium.url"
              component={ImageUpload}
              label={
                <React.Fragment>
                  Image:
                  <span className="required" aria-hidden>*</span>
                </React.Fragment>
              }
              id="profile_image"
              required={isCreateForm}
            />
            <Field
              name="given_name"
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
              name="family_name"
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
              name="position.title"
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
              name="position.organization_id"
              component={RenderSelectField}
              options={extractOrgChoices(stafferOptions)}
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
              name="major_works"
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
              name="urls_detailed"
              component={SocialLinks}
            />
            <FieldArray
              name="areas_of_expertise"
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

BaseStafferForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  stafferOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  isSaving: PropTypes.bool,
  isCreateForm: PropTypes.bool,
};

BaseStafferForm.defaultProps = {
  stafferOptions: {},
  isSaving: false,
  isCreateForm: false,
};

export default reduxForm({
  form: 'create-staffer-form',
})(BaseStafferForm);
export { basicValidate, extractOrgChoices, BaseStafferForm };
