import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from '@edx/paragon';

const RenderInputTextField = ({
  id,
  input,
  label,
  type,
  disabled,
  required,
  meta: { touched, error },
}) => (
  <InputText
    id={id}
    {...input}
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
  id: undefined,
  disabled: false,
  required: false,
};

RenderInputTextField.propTypes = {
  id: PropTypes.string,
  input: PropTypes.shape({}).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default RenderInputTextField;
