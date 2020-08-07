import React from 'react';
import PropTypes from 'prop-types';

function Pane(props) {
  return (
    <div className="card mb-3">
      <div className="card-header bg-primary text-white">{props.title}</div>
      <div className="card-body">
        {props.children}
      </div>
    </div>
  );
}

Pane.defaultProps = {
  children: [],
};

Pane.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};

export default Pane;
