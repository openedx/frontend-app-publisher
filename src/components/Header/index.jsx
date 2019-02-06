import React from 'react';
import { Link } from 'react-router-dom';
import { Hyperlink } from '@edx/paragon';

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
        <div className="col">
          <header className="d-flex justify-content-left align-items-center p-3 border-bottom-blue">
            <div className="col-md-auto">
              <Hyperlink content={this.renderLogo()} destination={process.env.LMS_BASE_URL} />
              <span className="badge badge-secondary beta">Alpha</span>
            </div>
            <div className="col-md-auto">
              <Link to="/">Courses</Link>
            </div>
          </header>
        </div>
      </div>
    );
  }
}

export default Header;
