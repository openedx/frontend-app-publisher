import React from 'react';
import PropTypes from 'prop-types';
import RemoveButton from '../RemoveButton';

function User(props) {
  return (
    <div>
      <span className="text-gray-800">{props.name}</span>
      {props.onRemove
        && (
        <RemoveButton
          className="align-text-top"
          label="Remove"
          targetFieldNumber={props.userId}
          onRemove={props.onRemove}
        />
        )}
      <p className="text-gray-500"><sub>{props.email}</sub></p>
    </div>
  );
}

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
