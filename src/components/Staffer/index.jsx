import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';


export const getStafferName = staffer => `${staffer.given_name} ${staffer.family_name || ''}`;

export const Staffer = ({ staffer, onRemove }) => (
  <React.Fragment>
    <div className="staffer-image-wrapper overflow-hidden">
      <img src={staffer.profile_image_url} className="rounded-circle w-50" alt="" />
    </div>
    <div className="staffer-details">
      <button className="btn js-delete-btn mr-1 p-0" onClick={() => onRemove(staffer.uuid)}>
        <Icon
          id={`delete-icon-${staffer.uuid}`}
          className={['fa', 'fa-trash', 'fa-fw', 'text-danger']}
          screenReaderText={`Remove ${getStafferName(staffer)}`}
        />
      </button>
      <button className="btn mr-1 p-0">
        <Icon
          id={`edit-icon-${staffer.uuid}`}
          className={['fa', 'fa-edit', 'fa-fw']}
          screenReaderText={`Edit ${getStafferName(staffer)}`}
          title="Edit"
        />
      </button>
      <span className="name font-weight-bold">
        {getStafferName(staffer)}
      </span>
    </div>
  </React.Fragment>
);

Staffer.propTypes = {
  onRemove: PropTypes.func.isRequired,
  staffer: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    given_name: PropTypes.string.isRequired,
    family_name: PropTypes.string,
    profile_image_url: PropTypes.string.isRequired,
  }).isRequired,
};
