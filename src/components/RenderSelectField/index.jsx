import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';

const RenderSelectField = ({
  input,
  extraInput,
  name,
  label,
  disabled,
  required,
  meta: { touched, error },
  options,
  errHasIcon,
}) => (
  <Form.Group controlId={`${name}-text-label`} isInvalid={touched && error}>
    <Form.Label>
      {label}
    </Form.Label>
    <Form.Control
      {...input}
      {...extraInput}
      as="select"
      name={name}
      label={label}
      disabled={disabled}
      required={required}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
      {touched && error && (
      <Form.Control.Feedback hasIcon={errHasIcon}>
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
  errHasIcon: false,
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
  errHasIcon: PropTypes.bool,
};

export default RenderSelectField;
