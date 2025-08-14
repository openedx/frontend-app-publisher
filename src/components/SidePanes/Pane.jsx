import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';

const Pane = (props) => (
  <div data-testid={props.dataTestId} className="card mb-3">
    <div className="card-header bg-primary-700 text-white p-3" >
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
  dataTestId: PropTypes.string,
};

export default Pane;