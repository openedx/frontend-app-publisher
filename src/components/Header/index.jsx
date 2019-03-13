import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown, Hyperlink } from '@edx/paragon';

import apiClient from '../../data/apiClient';
import EdxLogo from '../../../assets/edx-sm.png';
import './Header.scss';


class Header extends React.Component {
  renderLogo() {
    return (
      <img src={EdxLogo} alt="edX logo" height="30" width="60" />
    );
  }

  render() {
    return (
      <div className="row mb-3">
        <div className="col-10 offset-1">
          <header className="d-flex align-items-center p-3 border-bottom-blue">
            <div className="col-md-auto">
              <Hyperlink content={this.renderLogo()} destination={process.env.STUDIO_BASE_URL} />
              <span className="badge badge-secondary beta">Alpha</span>
            </div>
            <div className="col-md-auto">
              <Link to="/">Courses</Link>
            </div>
            <div className="ml-auto">
              <Dropdown
                title={this.props.username}
                menuItems={[
                  <button
                    className=""
                    onClick={() => apiClient.logout(process.env.STUDIO_BASE_URL)}
                  >Sign Out
                  </button>,
                ]}
              />
            </div>
          </header>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Header;
