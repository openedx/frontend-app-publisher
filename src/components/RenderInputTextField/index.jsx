import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';

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
  errHasIcon,
}) => (
  <Form.Group controlId={`${name}-text-label`} isInvalid={touched && error}>
    <Form.Label>
      {label}
    </Form.Label>
    <Form.Control
      {...input}
      {...extraInput}
      id={`${name}-text-label`}
      placeholder={placeholder}
      maxLength={maxLength}
      pattern={pattern}
      name={name}
      type={type}
      disabled={disabled}
      required={required}
    />
    {touched && error && (
    <Form.Control.Feedback hasIcon={errHasIcon}>
      {error}
    </Form.Control.Feedback>
    )}
  </Form.Group>
);

RenderInputTextField.defaultProps = {
  extraInput: {},
  name: '',
  disabled: false,
  required: false,
  maxLength: '',
  placeholder: '',
  pattern: null,
  errHasIcon: false,
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
  errHasIcon: PropTypes.bool,
};

export default RenderInputTextField;
