// TODO: This file can be deleted as a part of https://github.com/openedx/frontend-app-publisher/pull/761
// When we migrate off deprecated paragon components, we want to replace the contents of ./index.jsx
// with the contents of this file and then delete this file.
// Adding this file to the codebase as a temporary measure
// because the existing select component doesn't have multiselect functionality
// and it doesn't make sense to edit paragon to add that functionality bc we're moving off that component soon.

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
