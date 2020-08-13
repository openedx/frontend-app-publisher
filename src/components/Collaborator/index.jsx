import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import { Link } from 'react-router-dom';

import sourceInfo from '../../data/actions/sourceInfo';
import store from '../../data/store';

// default exported components don't play nicely with React.createElement
// eslint-disable-next-line import/prefer-default-export
export const Collaborator = ({
  item: {
    image_url: imageUrl,
    uuid,
    name,
  },
  onRemove,
  disabled,
  referrer,
}) => (
  <>
    <div className="staffer-image-wrapper overflow-hidden">
      <img src={imageUrl} className="w-25" alt="" />
    </div>
    <div className="staffer-details">
      <button
        type="button"
        className="btn js-delete-btn mr-1 p-0"
        onClick={() => onRemove(uuid)}
        disabled={disabled}
      >
        <Icon
          id={`delete-icon-${uuid}`}
          className="fa fa-trash fa-fw text-danger"
          screenReaderText={`Remove ${name}`}
        />
      </button>
      { !disabled
      // Don't show the edit link at all if fields should be disabled
      && (
        <Link
          to={{
            pathname: `/collaborators/${uuid}`,
            state: {
              name,
              imageUrl,
              uuid,
            },
          }}
          className="btn mr-1 p-0"
          onClick={() => store.dispatch(sourceInfo(referrer))}
        >
          <Icon
            id={`edit-icon-${uuid}`}
            className="fa fa-edit fa-fw"
            screenReaderText={`Edit ${name}`}
            title="Edit"
          />
        </Link>
      )}
      <span className="name font-weight-bold">
        {name}
      </span>
    </div>
  </>
);

Collaborator.propTypes = {
  onRemove: PropTypes.func.isRequired,
  item: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  referrer: PropTypes.string.isRequired,
};

Collaborator.defaultProps = {
  disabled: false,
};
