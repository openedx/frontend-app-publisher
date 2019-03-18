import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const LoadingMessage = (props) => {
  const { className } = props;
  return (
    <div
      className={classNames(
        'loading d-flex align-items-center justify-content-center',
        className,
      )}
    >
      { props.message ? props.message : 'Loading…' }
    </div>
  );
};

LoadingMessage.defaultProps = {
  message: null,
};

LoadingMessage.propTypes = {
  className: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default LoadingMessage;
