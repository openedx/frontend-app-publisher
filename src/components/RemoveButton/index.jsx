import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Close } from '@edx/paragon/icons';

const RemoveButton = ({
  className,
  label,
  onRemove,
  targetFieldNumber,
}) => (
  <button
    type="button"
    className={classNames('close float-none d-flex justify-content-center align-items-center', className)}
    aria-label={label}
    title={label}
    onClick={() => onRemove(targetFieldNumber)}
  >
    <Close
      id="remove-field"
    />
  </button>
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
