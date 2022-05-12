import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon } from '@edx/paragon';
import { CloseSmall } from '@edx/paragon/icons';

const RemoveButton = ({
  className,
  label,
  onRemove,
  targetFieldNumber,
}) => (
  <button
    type="button"
    className={classNames('close float-none', className)}
    aria-label={label}
    title={label}
    onClick={() => onRemove(targetFieldNumber)}
  >
    <Icon
      id="remove-field"
      src={CloseSmall}
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
