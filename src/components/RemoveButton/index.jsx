import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';

const RemoveButton = ({
  className,
  label,
  onRemove,
  targetFieldNumber,
}) => (
  <div className={className}>
    <button
      type="button"
      className="close float-none"
      aria-label={label}
      onClick={() => onRemove(targetFieldNumber)}
    >
      <Icon
        id="remove-field"
        className={['fa', 'fa-close']}
      />
    </button>
  </div>
);

RemoveButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  targetFieldNumber: PropTypes.number.isRequired,
};

RemoveButton.defaultProps = {
  className: '',
};

export default RemoveButton;
