import React from 'react';
import PropTypes from 'prop-types';

const FieldLabel = (props) => {
  let requireText = '';
  if (props.required) {
    requireText = <span className="text-danger" aria-hidden> * Required</span>;
  } else if (props.requiredForSubmit) {
    requireText = <span className="text-info" aria-hidden> * Required for submission</span>;
  }

  return (
    <div className={props.className}>
      <strong>{props.text}:</strong>
      {requireText}
    </div>
  );
};

FieldLabel.defaultProps = {
  className: '',
  required: false,
  requiredForSubmit: false,
};

FieldLabel.propTypes = {
  className: PropTypes.string,
  required: PropTypes.bool,
  requiredForSubmit: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export default FieldLabel;
