import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';


// TODO: Make these actually do something
const removeStaff = () => {};

const editStaff = () => {};

const getStafferName = staffer => `${staffer.given_name} ${staffer.family_name || ''}`;

const StaffGrid = ({ staff }) => (
  <div className="staff-grid row">
    {staff.map(staffer => (
      <div className="staffer-wrapper col-6 col-md-4 col-lg-3 col-xl-2" key={staffer.uuid}>
        <div className="staffer-image-wrapper overflow-hidden">
          <img src={staffer.profile_image_url} className="rounded-circle w-50" alt="" />
        </div>
        <div className="staffer-details">
          <button className="btn mr-1 p-0" onClick={() => removeStaff()}>
            <Icon
              id="delete-icon"
              className={['fa', 'fa-trash', 'fa-fw', 'text-danger']}
              screenReaderText={`Remove ${getStafferName(staffer)}`}
            />
          </button>
          <button className="btn mr-1 p-0" onClick={() => editStaff()}>
            <Icon
              id="edit-icon"
              className={['fa', 'fa-edit', 'fa-fw']}
              screenReaderText={`Edit ${getStafferName(staffer)}`}
            />
          </button>
          <span className="name font-weight-bold">
            {getStafferName(staffer)}
          </span>
        </div>
      </div>
    ))}
  </div>
);

StaffGrid.propTypes = {
  staff: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    given_name: PropTypes.string.isRequired,
    family_name: PropTypes.string,
    profile_image_url: PropTypes.string.isRequired,
  })).isRequired,
};

export default StaffGrid;
