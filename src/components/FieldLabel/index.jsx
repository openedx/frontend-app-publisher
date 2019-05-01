import React from 'react';
import PropTypes from 'prop-types';
import FieldHelp from '../FieldHelp';

const FieldLabel = ({
  className,
  extraText,
  helpText,
  id,
  required,
  requiredForSubmit,
  text,
}) => {
  let requireText = '';
  if (required) {
    requireText = <span className="text-danger" aria-hidden> * Required</span>;
  } else if (requiredForSubmit) {
    requireText = <span className="text-info" aria-hidden> * Required for submission</span>;
  }

  return (
    <div id={id} className={className}>
      <strong>{text}</strong>
      {helpText && id && <FieldHelp id={`${id}-help`} tip={helpText} />}
      {requireText}
      {extraText}
    </div>
  );
};

FieldLabel.defaultProps = {
  className: '',
  extraText: '',
  helpText: '',
  id: null,
  required: false,
  requiredForSubmit: false,
};

FieldLabel.propTypes = {
  className: PropTypes.string,
  extraText: PropTypes.string,
  helpText: PropTypes.node,
  id: PropTypes.string,
  required: PropTypes.bool,
  requiredForSubmit: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export default FieldLabel;
