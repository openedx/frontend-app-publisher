import React from 'react';
import { Hyperlink } from '@edx/paragon';

import EdxLogo from '../../../assets/edx-sm.png';
import './Header.scss';

export default class Header extends React.Component {
  renderLogo() {
    return (
      <img src={EdxLogo} alt="edX logo" height="30" width="60" />
    );
  }

  render() {
    return (
      <div className="mb-3">
        <header className="d-flex justify-content-left align-items-center p-3 border-bottom-blue">
          <Hyperlink content={this.renderLogo()} destination="https://www.edx.org" />
          <span className="badge badge-secondary beta">Alpha</span>
          <div />
        </header>
      </div>
    );
  }
}
