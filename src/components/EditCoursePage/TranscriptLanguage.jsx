import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import RenderSelectField from '../RenderSelectField';
import RemoveButton from '../RemoveButton';

class TranscriptLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(index) {
    this.props.fields.remove(index);
  }

  render() {
    const { fields, languageOptions, disabled } = this.props;

    return (
      <div className="transcript-languages mb-3">
        <ul className="list-group p-0 m-0">
          {fields.map((language, index) => (
            <li className="transcript-language list-group-item d-flex align-items-center border-0 p-0 m-0" key={language}>
              <Field
                name={`${language}`}
                component={RenderSelectField}
                options={languageOptions}
                type="text"
                disabled={disabled}
              />
              <RemoveButton
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
          className="btn btn-outline-primary js-add-button"
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
  fields: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
  languageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  disabled: PropTypes.bool,
};

TranscriptLanguage.defaultProps = {
  disabled: false,
};

export default TranscriptLanguage;
