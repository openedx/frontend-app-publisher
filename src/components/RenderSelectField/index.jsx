import React from 'react';
import PropTypes from 'prop-types';
import { InputSelect } from '@edx/paragon';

const RenderSelectField = ({
  input,
  extraInput,
  name,
  label,
  disabled,
  required,
  meta: { touched, error },
  options,
}) => (
  <InputSelect
    {...input}
    {...extraInput}
    name={name}
    label={label}
    disabled={disabled}
    required={required}
    isValid={!(touched && error)}
    validationMessage={error}
    themes={['danger']}
    options={options}
  />
);

RenderSelectField.defaultProps = {
  extraInput: {},
  name: '',
  disabled: false,
  required: false,
};

RenderSelectField.propTypes = {
  input: PropTypes.shape({}).isRequired,
  extraInput: PropTypes.shape({}),
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object),
  ]).isRequired,
};

export default RenderSelectField;
