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
    const { fields, languageOptions } = this.props;

    return (
      <div className="transcript-languages my-4">
        <ul className="list-group p-0 m-0">
          {fields.map((language, index) => (
            <li className="transcript-language list-group-item row d-flex align-items-center px-0 mx-0" key={language}>
              <div className="col-10">
                <Field
                  name={`${language}`}
                  component={RenderSelectField}
                  label="Transcript Language"
                  options={languageOptions}
                  type="text"
                />
              </div>
              <RemoveButton
                label="Remove language"
                onRemove={this.handleRemove}
                targetFieldNumber={index}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-light js-add-button"
          onClick={() => fields.push({})}
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
};

export default TranscriptLanguage;
