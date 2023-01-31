import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from '@edx/paragon';
import { InfoOutline } from '@edx/paragon/icons';

const Pane = (props) => (
  <div className="card mb-3">
    <div className="card-header bg-primary-700 text-white">
      {props.title}
      {props.info && (
      <OverlayTrigger
        placement="top"
        trigger="hover"
        overlay={(
          <Tooltip id={`tooltip-${props.title}`}>
            {props.info}
          </Tooltip>
           )}
      >
        <InfoOutline className="float-right" style={{ height: '20px', width: '20px' }} />
      </OverlayTrigger>
      )}
    </div>
    <div className="card-body">
      {props.children}
    </div>
  </div>
);

Pane.defaultProps = {
  children: [],
  info: null,
};

Pane.propTypes = {
  children: PropTypes.node,
  info: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Pane;
