import React from 'react';
import { Spinner } from '@edx/paragon';
import PropTypes from 'prop-types';

function LoadingSpinner(props) {
  return (
    <div className="mx-auto text-center">
      <div>
        { props.message }
      </div>
      <Spinner animation="border" className="mie-3" screenReaderText="loading" />
    </div>
  );
}

LoadingSpinner.defaultProps = {
  message: 'Loading…',
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
