import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import {
  Alert, Container,
} from 'react-bootstrap';

const SitewideBanner = ({
  message, type, dismissible, cookieName, cookieExpiryDays,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (cookieName && Cookies.get(cookieName)) {
      setIsVisible(false);
    }
  }, [cookieName]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (cookieName) {
      Cookies.set(cookieName, 'true', { expires: cookieExpiryDays });
    }
  };

  if (isVisible) {
    return (
      <Alert
        variant={type}
        dismissible={dismissible}
        onClose={handleDismiss}
        className="mb-4"
      >
        <Container>
          {message}
        </Container>
      </Alert>
    );
  } else { // eslint-disable-line no-else-return
    return null;
  }
};

SitewideBanner.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'info', 'secondary', 'light', 'dark']),
  dismissible: PropTypes.bool,
  cookieName: PropTypes.string,
  cookieExpiryDays: PropTypes.number,
};

SitewideBanner.defaultProps = {
  type: 'info',
  dismissible: false,
  cookieName: null,
  cookieExpiryDays: 7,
};

export default SitewideBanner;
