import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import RenderSelectField from '../RenderSelectField';
import RemoveButton from '../RemoveButton';
import FieldLabel from '../FieldLabel';
import StatusAlert from '../StatusAlert';

class TranscriptLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(index) {
    this.props.fields.remove(index);
  }

  render() {
    const {
      fields,
      languageOptions,
      disabled,
      meta: {
        submitFailed,
        error,
      },
    } = this.props;

    return (
      // Set tabindex to -1 to allow programmatic shifting of focus for validation
      <div className="transcript-languages mb-3" name={fields.name} tabIndex="-1">
        {submitFailed && error
          && (
          <StatusAlert
            alertType="danger"
            message={error}
          />
          )}
        <ul className="list-group p-0 m-0 container-fluid">
          {fields.map((language, index) => (
            <li className="transcript-language list-group-item row d-flex align-items-center px-0 mx-0" key={language}>
              <div className="col-11">
                <Field
                  name={`${language}`}
                  component={RenderSelectField}
                  options={languageOptions}
                  type="text"
                  label={<FieldLabel text="Transcript language" required />}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  disabled={disabled}
                  required
                />
              </div>
              <RemoveButton
                className="col-1"
                label="Remove language"
                onRemove={this.handleRemove}
                targetFieldNumber={index}
                disabled={disabled}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-outline-primary js-add-button mt-2"
          onClick={() => fields.push({})}
          disabled={disabled}
        >
          Add language
        </button>
      </div>
    );
  }
}

TranscriptLanguage.propTypes = {
  fields: PropTypes.instanceOf(FieldArray).isRequired,
  languageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  disabled: PropTypes.bool,
  extraInput: PropTypes.shape({}),
  meta: PropTypes.shape({
    submitFailed: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
};

TranscriptLanguage.defaultProps = {
  disabled: false,
  extraInput: {},
};

export default TranscriptLanguage;
