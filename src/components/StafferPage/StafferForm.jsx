import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AreasOfExpertise from './AreasOfExpertise';
import SocialLinks from './SocialLinks';
import ImageUpload from '../../components/ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RichEditor from '../../components/RichEditor';
import FieldLabel from '../FieldLabel';
import ButtonToolbar from '../ButtonToolbar';
import { getPreviousCourseEditUrl } from './index';


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
  fromEditCourse,
}) => {
  const formControlDisabled = pristine || submitting || isSaving;

  return (
    <div className="create-staffer-form">
      <form onSubmit={handleSubmit}>
        <Field
          name="profile_image.medium.url"
          component={ImageUpload}
          label={<FieldLabel text="Image" required />}
          id="profile_image"
          required={isCreateForm}
        />
        <Field
          name="given_name"
          component={RenderInputTextField}
          type="text"
          label={<FieldLabel text="First name" required />}
          required
        />
        <Field
          name="family_name"
          component={RenderInputTextField}
          type="text"
          label={<FieldLabel text="Last name" required />}
          required
        />
        <Field
          name="position.title"
          component={RenderInputTextField}
          type="text"
          label={<FieldLabel text="Position" required />}
          required
        />
        <Field
          name="position.organization_id"
          component={RenderSelectField}
          options={extractOrgChoices(stafferOptions)}
          label={<FieldLabel text="Organization" required />}
          required
        />
        <Field
          name="bio"
          component={RichEditor}
          label={<FieldLabel text="Biography" required />}
          maxChars={250}
          validate={basicValidate}
          id="bio"
        />
        <Field
          name="major_works"
          component={RichEditor}
          label={<FieldLabel text="Major works" />}
          maxChars={250}
          id="works"
        />
        <FieldLabel text="Social links" className="mb-2" />
        <FieldArray
          name="urls_detailed"
          component={SocialLinks}
        />
        <FieldLabel text="Areas of expertise" className="mb-2" />
        <FieldArray
          name="areas_of_expertise"
          component={AreasOfExpertise}
        />
        <ButtonToolbar>
          <Link
            className={['btn btn-outline-primary form-cancel-btn']}
            to={fromEditCourse.fromEditCourse ? getPreviousCourseEditUrl(fromEditCourse.courseUuid) : '/'}
            disabled={formControlDisabled}
          >
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary form-submit-btn" disabled={formControlDisabled} >
            Submit
          </button>
        </ButtonToolbar>
      </form>
    </div>
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
  fromEditCourse: PropTypes.shape({
    fromEditCourse: PropTypes.bool,
    courseUuid: PropTypes.string,
  }).isRequired,
};

BaseStafferForm.defaultProps = {
  stafferOptions: {},
  isSaving: false,
  isCreateForm: false,
};

export default reduxForm({
  form: 'staffer-form',
})(BaseStafferForm);
export { basicValidate, extractOrgChoices, BaseStafferForm };
