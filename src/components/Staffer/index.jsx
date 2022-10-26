import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import { Link } from 'react-router-dom';

import sourceInfo from '../../data/actions/sourceInfo';
import store from '../../data/store';

export const getStafferName = staffer => `${staffer.given_name} ${staffer.family_name || ''}`;

export const Staffer = ({
  item,
  onRemove,
  disabled,
  referrer,
  courseRunKey,
}) => (
  <>
    <div className="staffer-image-wrapper overflow-hidden">
      <img src={item.profile_image_url} className="rounded-circle w-25" alt="" />
    </div>
    <div className="staffer-details">
      <button
        type="button"
        className="btn js-delete-btn mr-1 p-0"
        onClick={() => onRemove(item.uuid)}
        disabled={disabled}
      >
        <Icon
          id={`delete-icon-${item.uuid}`}
          className="fa fa-trash fa-fw text-danger"
          screenReaderText={`Remove ${getStafferName(item)}`}
        />
      </button>
      { !disabled
        // Don't show the edit link at all if fields should be disabled
        && (
        <Link
          to={`/instructors/${item.uuid}`}
          className="btn mr-1 p-0"
          onClick={() => store.dispatch(sourceInfo(referrer, courseRunKey))}
        >
          <Icon
            id={`edit-icon-${item.uuid}`}
            className="fa fa-edit fa-fw"
            screenReaderText={`Edit ${getStafferName(item)}`}
            title="Edit"
          />
        </Link>
        )}
      <span className="name font-weight-bold">
        {getStafferName(item)}
      </span>
    </div>
  </>
);

Staffer.propTypes = {
  onRemove: PropTypes.func.isRequired,
  item: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    given_name: PropTypes.string.isRequired,
    family_name: PropTypes.string,
    profile_image_url: PropTypes.string.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  referrer: PropTypes.string.isRequired,
  courseRunKey: PropTypes.string.isRequired,
};

Staffer.defaultProps = {
  disabled: false,
};
