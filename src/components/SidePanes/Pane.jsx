import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from '@edx/paragon';
import { InfoOutline } from '@edx/paragon/icons';

function Pane(props) {
  return (
    <div className="card mb-3">
      <div className="card-header bg-primary text-white">
        {props.title}
        {props.info && (
          <OverlayTrigger
            placement="top"
            trigger="hover"
            overlay={(
              <Tooltip>
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
}

Pane.defaultProps = {
  children: [],
  info: null,
};

Pane.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  info: PropTypes.string,
};

export default Pane;
