import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { StatefulButton } from '@edx/paragon';

// Just a tiny wrapper around StatefulButton to provide some good defaults
const ActionButton = ({ className, primary, ...passThroughProps }) => (
  <StatefulButton
    {...passThroughProps}
    type="submit"
    className={classNames({
      btn: true,
      'btn-primary': primary,
      'btn-outline-primary': !primary,
      'form-submit-btn': true,
    }, className)}
  />
);

ActionButton.defaultProps = {
  className: '',
  primary: true,
};

ActionButton.propTypes = {
  className: PropTypes.string,
  primary: PropTypes.bool,
};

export default ActionButton;
