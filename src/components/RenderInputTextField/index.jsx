import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import { isRtl } from '../../utils';

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
      dir={isRtl(input.value) ? 'rtl' : 'ltr'}
      disabled={disabled}
      required={required}
    />
    {touched && error && (
    <Form.Control.Feedback>
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
};

RenderInputTextField.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string,
  }).isRequired,
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
