import React from 'react';
import PropTypes from 'prop-types';
import RemoveButton from '../RemoveButton';

function User(props) {
  return (
    <div>
      {props.name}
      {props.onRemove
        && (
        <RemoveButton
          className="align-text-bottom ml-1"
          label="Remove"
          targetFieldNumber={props.userId}
          onRemove={props.onRemove}
        />
        )}
    </div>
  );
}

User.defaultProps = {
  onRemove: null,
};

User.propTypes = {
  name: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  userId: PropTypes.number.isRequired,
};

export default User;
