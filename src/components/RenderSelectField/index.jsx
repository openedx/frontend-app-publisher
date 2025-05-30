import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const RenderSelectField = ({
  input,
  extraInput,
  name,
  label,
  disabled,
  hidden,
  required,
  meta: { touched, error },
  options,
}) => (
  <Form.Group controlId={`${input.name}-text-label`} isInvalid={touched && error}>
    {hidden ? null : <Form.Label>{label}</Form.Label>}
    <Form.Control
      name={name}
      label={label}
      {...input}
      {...extraInput}
      as="select"
      disabled={disabled}
      hidden={hidden}
      required={required}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
      {touched && error && (
      <Form.Control.Feedback>
        {error}
      </Form.Control.Feedback>
      )}
    </Form.Control>
  </Form.Group>
);

RenderSelectField.defaultProps = {
  extraInput: {},
  name: '',
  disabled: false,
  required: false,
  hidden: false,
};

RenderSelectField.propTypes = {
  input: PropTypes.shape({ name: PropTypes.string }).isRequired,
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
  hidden: PropTypes.bool,
};

export default RenderSelectField;
