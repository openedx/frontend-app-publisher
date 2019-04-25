import React from 'react';
import PropTypes from 'prop-types';
import FieldHelp from '../FieldHelp';

const FieldLabel = (props) => {
  let requireText = '';
  if (props.required) {
    requireText = <span className="text-danger" aria-hidden> * Required</span>;
  } else if (props.requiredForSubmit) {
    requireText = <span className="text-info" aria-hidden> * Required for submission</span>;
  }

  return (
    <div id={props.id} className={props.className}>
      <strong>{props.text}</strong>
      {props.helpText && props.id && <FieldHelp id={`${props.id}-help`} tip={props.helpText} />}
      {requireText}
    </div>
  );
};

FieldLabel.defaultProps = {
  className: '',
  helpText: '',
  id: null,
  required: false,
  requiredForSubmit: false,
};

FieldLabel.propTypes = {
  className: PropTypes.string,
  helpText: PropTypes.node,
  id: PropTypes.string,
  required: PropTypes.bool,
  requiredForSubmit: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export default FieldLabel;
