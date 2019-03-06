import React from 'react';
import PropTypes from 'prop-types';
import { InputSelect } from '@edx/paragon';

const RenderSelectField = ({
  id,
  input,
  label,
  disabled,
  required,
  meta: { touched, error },
  options,
}) => (
  <InputSelect
    id={id}
    {...input}
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
  id: undefined,
  disabled: false,
  required: false,
};

RenderSelectField.propTypes = {
  id: PropTypes.string,
  input: PropTypes.shape({}).isRequired,
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
