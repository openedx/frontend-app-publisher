import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActionButton from '../ActionButton';
import AreasOfExpertise from './AreasOfExpertise';
import SocialLinks from './SocialLinks';
import ImageUpload from '../ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import ReduxFormCreatableSelect from '../ReduxFormCreatableSelect';
import RichEditor from '../RichEditor';
import FieldLabel from '../FieldLabel';
import ButtonToolbar from '../ButtonToolbar';
import { basicValidate, handleStafferOrCreateFormFail } from '../../utils/validation';

const BaseStafferForm = ({
  handleSubmit,
  pristine,
  isSaving,
  isCreateForm,
  sourceInfo: { referrer },
  cancelStafferInfo,
  organizationName,
  publisherOrganizations,
}) => {
  const formControlDisabled = pristine || isSaving;
  const allOrganizations = organizationName
    ? [...publisherOrganizations.map(org => org.name), organizationName]
    : [...publisherOrganizations.map(org => org.name)];
  const allUniqueOrganizations = [...new Set(allOrganizations)];

  return (
    <div className="create-staffer-form">
      <form onSubmit={handleSubmit}>
        <Field
          name="profile_image.medium.url"
          component={ImageUpload}
          label={(
            <FieldLabel
              id="image.label"
              text="Image"
              helpText={(
                <div>
                  <p>Image Requirements:</p>
                  <ul>
                    <li>The image dimensions must be 110×110.</li>
                    <li>The image size must be less than 256KB.</li>
                  </ul>
                </div>
              )}
              extraText="Image must be 110x110 pixels in size."
            />
          )}
          id="profile_image"
          maxImageSizeKilo={256}
          requiredWidth={110}
          requiredHeight={110}
          className="staffer-image"
          required={isCreateForm}
          validate={basicValidate}
        />
        <Field
          name="given_name"
          component={RenderInputTextField}
          type="text"
          label={<FieldLabel text="First name" />}
          required
        />
        <Field
          name="family_name"
          component={RenderInputTextField}
          type="text"
          label={<FieldLabel text="Last name" />}
          required
        />
        <Field
          name="position.title"
          component={RenderInputTextField}
          type="text"
          label={(
            <FieldLabel
              id="title.label"
              text="Title"
              helpText={(
                <div>
                  <p>Instructor&apos;s title at your organization.</p>
                  <p><b>Examples:</b></p>
                  <ul>
                    <li>Professor</li>
                    <li>Content Developer</li>
                    <li>Director</li>
                  </ul>
                </div>
              )}
            />
          )}
          required
        />
        <Field
          name="position.organization_override"
          component={ReduxFormCreatableSelect}
          label={<FieldLabel text="Organization" />}
          currentValue={organizationName}
          options={
            allUniqueOrganizations.map(org => ({
              label: org,
              value: org,
            }))
          }
          isCreatable
          formatCreateLabel={(label) => label}
          validate={basicValidate}
          placeholder="Organization..."
        />
        <Field
          name="bio"
          component={RichEditor}
          label={<FieldLabel text="Biography" />}
          maxChars={1000}
          validate={basicValidate}
          id="bio"
        />
        <Field
          name="major_works"
          component={RichEditor}
          label={<FieldLabel text="Major works" optional />}
          maxChars={250}
          id="works"
        />
        <FieldLabel text="Social links" className="mb-2" optional />
        <FieldArray
          name="urls_detailed"
          component={SocialLinks}
        />
        <FieldLabel text="Areas of expertise" className="mb-2" optional />
        <FieldArray
          name="areas_of_expertise"
          component={AreasOfExpertise}
        />
        <ButtonToolbar>
          <Link
            className="btn btn-outline-primary form-cancel-btn"
            to={referrer || '/'}
            disabled={formControlDisabled}
            onClick={cancelStafferInfo}
          >
            Cancel
          </Link>
          <ActionButton
            disabled={formControlDisabled}
            labels={isCreateForm ? {
              default: 'Create',
              pending: 'Creating',
            } : {
              default: 'Save',
              pending: 'Saving',
            }}
            state={isSaving ? 'pending' : 'default'}
          />
        </ButtonToolbar>
      </form>
    </div>
  );
};

BaseStafferForm.propTypes = {
  cancelStafferInfo: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  isCreateForm: PropTypes.bool,
  organizationName: PropTypes.string,
  pristine: PropTypes.bool.isRequired,
  sourceInfo: PropTypes.shape({
    referrer: PropTypes.string,
  }).isRequired,
  publisherOrganizations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
};

BaseStafferForm.defaultProps = {
  cancelStafferInfo: () => {},
  isSaving: false,
  isCreateForm: false,
  organizationName: '',
  publisherOrganizations: [],
};

export default reduxForm({
  form: 'staffer-form',
  onSubmitFail: handleStafferOrCreateFormFail,
})(BaseStafferForm);
export { basicValidate, BaseStafferForm };
