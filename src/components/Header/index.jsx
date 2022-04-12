import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { Link } from 'react-router-dom';
import { redirectToLogout } from '@edx/frontend-platform/auth';
import { AppContext } from '@edx/frontend-platform/react';
import {
  Dropdown, Hyperlink, AvatarButton,
} from '@edx/paragon';

const Header = ({ darkModeOn, location, toggleDarkMode }) => {
  const { authenticatedUser } = useContext(AppContext);

  if (darkModeOn) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Allow users to toggle dark mode on if they put in a querystring like ?bananas=1
  const querystringParams = qs.parse(location.search);
  const allowDarkModeToggle = querystringParams.bananas;

  return (
    <header className="site-header mb-3 py-3 border-bottom-blue">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-auto justify-content-start">
            <Hyperlink destination={process.env.BASE_URL}>
              <img src={process.env.LOGO_URL} alt="edX logo" height="30" width="60" />
            </Hyperlink>
          </div>
          <div className="col">
            <Link to="/">Courses</Link>
          </div>
          {allowDarkModeToggle
            && (
            <div className="col-auto justify-content-end">
              <button type="button" className="btn btn-primary" onClick={toggleDarkMode}>
                Switch to {darkModeOn ? 'light mode' : 'dark mode'}
              </button>
            </div>
            )}
          <div className="col-auto justify-content-end">
            <>
              <Dropdown>
                <Dropdown.Toggle as={AvatarButton}>
                  {authenticatedUser.username}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => redirectToLogout(process.env.LMS_BASE_URL)}
                    key="dropdown-logout"
                  >
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  darkModeOn: PropTypes.bool,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  toggleDarkMode: PropTypes.func,
};

Header.defaultProps = {
  darkModeOn: false,
  location: {},
  toggleDarkMode: () => {},
};

export default Header;
