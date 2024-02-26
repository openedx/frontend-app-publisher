import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { Link, useLocation } from 'react-router-dom';
import { redirectToLogout } from '@edx/frontend-platform/auth';
import { AppContext } from '@edx/frontend-platform/react';
import {
  Dropdown, Hyperlink, AvatarButton,
} from '@edx/paragon';
import { getConfig } from '@edx/frontend-platform';

const Header = ({ darkModeOn, toggleDarkMode }) => {
  const { authenticatedUser } = useContext(AppContext);
  const location = useLocation();

  if (darkModeOn) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Allow users to toggle dark mode on if they put in a querystring like ?bananas=1
  const querystringParams = qs.parse(location.search);
  const { pathname } = location;
  const allowDarkModeToggle = querystringParams.bananas;

  function disableLink(courseType) {
    const courseTypeFromURL = querystringParams.course_type ? querystringParams.course_type : '';
    return (courseTypeFromURL === courseType && pathname === '/') ? 'disabled-link text-gray-300' : '';
  }

  return (
    <header className="site-header mb-3 py-3 border-bottom border-gray-300">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-auto justify-content-start">
            <Hyperlink destination={getConfig().BASE_URL}>
              <img src={getConfig().LOGO_URL} alt="edX logo" height="30" />
            </Hyperlink>
          </div>
          <div className="col-auto justify-content-start">
            <Link to="/" className={disableLink('')}>Open Courses</Link>
          </div>
          <div className="col-auto justify-content-start">
            <Link to="/?course_type=executive-education-2u" className={disableLink('executive-education-2u')}>Executive Education</Link>
          </div>
          <div className="col-auto justify-content-start">
            <Link to="/?course_type=bootcamp-2u" className={disableLink('bootcamp-2u')}>Bootcamps</Link>
          </div>

          {allowDarkModeToggle
            && (
            <div className="col-auto justify-content-end">
              <button type="button" className="btn btn-primary" onClick={toggleDarkMode}>
                Switch to {darkModeOn ? 'light mode' : 'dark mode'}
              </button>
            </div>
            )}
          <div className="col-auto justify-content-end ml-auto">
            <Dropdown>
              <Dropdown.Toggle as={AvatarButton}>
                {authenticatedUser.username}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => redirectToLogout(getConfig().LMS_BASE_URL)}
                  key="dropdown-logout"
                >
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  darkModeOn: PropTypes.bool,
  toggleDarkMode: PropTypes.func,
};

Header.defaultProps = {
  darkModeOn: false,
  toggleDarkMode: () => {},
};

export default Header;
