import React from 'react';
import PropTypes from 'prop-types';
import RemoveButton from '../RemoveButton';

const User = (props) => (
  <div data-testid="test-id-user" data-name={props.name} data-email={props.email} data-user-id={props.userId}>
    <div className="d-flex">
      <span title={props.name} className="text-gray-800 text-truncate">{props.name}</span>
      {props.onRemove
          && (
          <RemoveButton
            data-testid="id-remove-btn"
            className="align-text-bottom ml-1"
            label="Remove"
            targetFieldNumber={props.userId}
            onRemove={props.onRemove}
          />
          )}
    </div>
    <p title={props.email} className="text-gray-500 text-truncate h5 font-weight-normal">{props.email}</p>
  </div>
);

User.defaultProps = {
  onRemove: null,
};

User.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  userId: PropTypes.number.isRequired,
};

export default User;
