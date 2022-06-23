import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Icon } from '@edx/paragon';

const StatusAlert = (props) => {
  const {
    alertType,
    className,
    iconClassNames,
    title,
    message,
    dismissible,
    onClose,
  } = props;
  const showIcon = () => (
    <div className="icon mr-2">
      <Icon className={iconClassNames} />
    </div>
  );

  return (
    <Alert
      className={className}
      variant={alertType}
      dismissible={dismissible}
      onClose={onClose}
      {...iconClassNames.length > 0 && { icon: showIcon }}
      show
    >
      <div className="message">
        <Alert.Heading>{title}</Alert.Heading>
        <p>{message}</p>
      </div>
    </Alert>
  );
};

StatusAlert.propTypes = {
  alertType: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.string, PropTypes.element, PropTypes.array,
  ]).isRequired,
  className: PropTypes.string,
  iconClassNames: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  dismissible: PropTypes.bool,
  onClose: PropTypes.func,
};

StatusAlert.defaultProps = {
  className: '',
  iconClassNames: [],
  title: null,
  dismissible: false,
  onClose: () => {},
};

export default StatusAlert;
