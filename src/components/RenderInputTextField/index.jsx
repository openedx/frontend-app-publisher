import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from '@edx/paragon';

const RenderInputTextField = ({
  input,
  extraInput,
  name,
  label,
  type,
  disabled,
  required,
  maxLength,
  placeholder,
  pattern,
  meta: { touched, error },
}) => (
  <InputText
    {...input}
    {...extraInput}
    placeholder={placeholder}
    maxLength={maxLength}
    pattern={pattern}
    name={name}
    label={label}
    type={type}
    disabled={disabled}
    required={required}
    isValid={!(touched && error)}
    validationMessage={error}
    themes={['danger']}
  />
);

RenderInputTextField.defaultProps = {
  extraInput: {},
  name: '',
  disabled: false,
  required: false,
  maxLength: '',
  placeholder: '',
  pattern: null,
};

RenderInputTextField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  extraInput: PropTypes.shape({}),
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  maxLength: PropTypes.string,
  placeholder: PropTypes.string,
  pattern: PropTypes.string,
};

export default RenderInputTextField;
