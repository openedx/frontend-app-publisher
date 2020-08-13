import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActionButton from '../ActionButton';
import ImageUpload from '../ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import FieldLabel from '../FieldLabel';
import ButtonToolbar from '../ButtonToolbar';
import { basicValidate } from '../../utils/validation';

const BaseCollaboratorForm = ({
  handleSubmit,
  pristine,
  isSaving,
  isCreateForm,
  sourceInfo: { referrer },
  cancelCollaboratorInfo,
}) => {
  const formControlDisabled = pristine || isSaving;

  return (
    <div className="create-collaborator-form">
      <form onSubmit={handleSubmit}>
        <Field
          name="image"
          component={ImageUpload}
          label={(
            <FieldLabel
              id="image.label"
              text="Image"
              helpText={(
                <div>
                  <p>Image Requirements:</p>
                  <ul>
                    <li>The image dimensions must be 200px × 100px.</li>
                    <li>The image size must be less than 256KB.</li>
                  </ul>
                </div>
              )}
              extraText="Image must be 200x100 pixels in size."
            />
          )}
          id="logo_image"
          maxImageSizeKilo={256}
          requiredWidth={200}
          requiredHeight={100}
          className="collaborator-image"
          required={isCreateForm}
        />
        <Field
          name="name"
          component={RenderInputTextField}
          type="text"
          label={<FieldLabel text="Name" />}
          required
        />
        <ButtonToolbar>
          <Link
            className="btn btn-outline-primary form-cancel-btn"
            to={referrer || '/'}
            disabled={formControlDisabled}
            onClick={cancelCollaboratorInfo}
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

BaseCollaboratorForm.propTypes = {
  cancelCollaboratorInfo: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  isCreateForm: PropTypes.bool,
  pristine: PropTypes.bool.isRequired,
  sourceInfo: PropTypes.shape({
    referrer: PropTypes.string,
  }).isRequired,
};

BaseCollaboratorForm.defaultProps = {
  cancelCollaboratorInfo: () => {},
  isSaving: false,
  isCreateForm: false,
};

export default reduxForm({
  form: 'collaborator-form',
})(BaseCollaboratorForm);
export { basicValidate, BaseCollaboratorForm };
