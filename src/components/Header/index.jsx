import React from 'react';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { Link } from 'react-router-dom';
import { Dropdown, Hyperlink } from '@edx/paragon';

import apiClient from '../../data/apiClient';
import EdxLogo from '../../../assets/edx-sm.png';

class Header extends React.Component {
  renderLogo() {
    return (
      <img src={EdxLogo} alt="edX logo" height="30" width="60" />
    );
  }

  render() {
    const { darkModeOn } = this.props;

    if (darkModeOn) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Allow users to toggle dark mode on if they put in a querystring like ?bananas=1
    const querystringParams = qs.parse(this.props.location.search);
    const allowDarkModeToggle = querystringParams.bananas;

    return (
      <header className="site-header mb-3 py-3 border-bottom-blue">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto justify-content-start">
              <Hyperlink content={this.renderLogo()} destination={process.env.STUDIO_BASE_URL} />
              <span className="badge badge-secondary beta">Beta</span>
            </div>
            <div className="col">
              <Link to="/">Courses</Link>
            </div>
            {allowDarkModeToggle &&
              <div className="col-auto justify-content-end">
                <button className="btn btn-primary" onClick={this.props.toggleDarkMode}>
                  Switch to {darkModeOn ? 'light mode' : 'dark mode'}
                </button>
              </div>
            }
            <div className="col-auto justify-content-end">
              <Dropdown
                title={this.props.username}
                menuItems={[
                  <button
                    className="dropdown-button"
                    onClick={() => apiClient.logout(process.env.STUDIO_BASE_URL)}
                  >Sign Out
                  </button>,
                ]}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  username: PropTypes.string.isRequired,
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
