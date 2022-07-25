import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { StatefulButton } from '@edx/paragon';

// Just a tiny wrapper around StatefulButton to provide some good defaults
function ActionButton({ className, primary, ...passThroughProps }) {
  return (
    <StatefulButton
      {...passThroughProps}
      type="submit"
      variant={primary ? 'primary' : 'outline-primary'}
      className={classNames({
        btn: true,
        'form-submit-btn': true,
      }, className)}
    />
  );
}

ActionButton.defaultProps = {
  className: '',
  primary: true,
};

ActionButton.propTypes = {
  className: PropTypes.string,
  primary: PropTypes.bool,
};

export default ActionButton;
