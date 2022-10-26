import React from 'react';
import PropTypes from 'prop-types';
import FieldHelp from '../FieldHelp';

const FieldLabel = ({
  className,
  extraText,
  helpText,
  id,
  optional,
  text,
}) => {
  let requireText = '';

  if (optional) {
    requireText = <span className="text-info" aria-hidden>   Optional</span>;
  }

  return (
    <div id={id} className={className}>
      <strong>{text}</strong>
      {helpText && id && <FieldHelp id={`${id}-help`} tip={helpText} />}
      {requireText}
      <div><span className="text-muted">{extraText}</span></div>
    </div>
  );
};

FieldLabel.defaultProps = {
  className: '',
  extraText: '',
  helpText: '',
  id: null,
  optional: false,
};

FieldLabel.propTypes = {
  className: PropTypes.string,
  extraText: PropTypes.string,
  helpText: PropTypes.node,
  id: PropTypes.string,
  optional: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export default FieldLabel;
