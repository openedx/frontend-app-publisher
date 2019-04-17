import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import { Link } from 'react-router-dom';

import sourceInfo from '../../data/actions/sourceInfo';
import store from '../../data/store';


export const getStafferName = staffer => `${staffer.given_name} ${staffer.family_name || ''}`;

export const Staffer = ({
  staffer,
  onRemove,
  disabled,
  courseUuid,
}) => (
  <React.Fragment>
    <div className="staffer-image-wrapper overflow-hidden">
      <img src={staffer.profile_image_url} className="rounded-circle w-25" alt="" />
    </div>
    <div className="staffer-details">
      <button
        type="button"
        className="btn js-delete-btn mr-1 p-0"
        onClick={() => onRemove(staffer.uuid)}
        disabled={disabled}
      >
        <Icon
          id={`delete-icon-${staffer.uuid}`}
          className={['fa', 'fa-trash', 'fa-fw', 'text-danger']}
          screenReaderText={`Remove ${getStafferName(staffer)}`}
        />
      </button>
      { !disabled &&
        // Don't show the edit link at all if fields should be disabled
        <Link
          to={`/instructors/${staffer.uuid}/edit`}
          className="btn mr-1 p-0"
          onClick={() => store.dispatch(sourceInfo(`/courses/${courseUuid}/edit`))}
        >
          <Icon
            id={`edit-icon-${staffer.uuid}`}
            className={['fa', 'fa-edit', 'fa-fw']}
            screenReaderText={`Edit ${getStafferName(staffer)}`}
            title="Edit"
          />
        </Link>
      }
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
  disabled: PropTypes.bool,
  courseUuid: PropTypes.string.isRequired,
};

Staffer.defaultProps = {
  disabled: false,
};
