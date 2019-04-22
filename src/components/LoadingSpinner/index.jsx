import React from 'react';
import { Icon } from '@edx/paragon';
import PropTypes from 'prop-types';

const LoadingSpinner = props => (
  <div className="mx-auto text-center">
    <div>
      { props.message }
    </div>
    <Icon
      id="spinner"
      className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"
    />
  </div>
);

LoadingSpinner.defaultProps = {
  message: 'Loading…',
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
