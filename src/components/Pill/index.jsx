import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  REVIEW_BY_LEGAL,
  REVIEW_BY_INTERNAL,
  PUBLISHED,
  REVIEWED,
  UNPUBLISHED,
  ARCHIVED,
} from '../../data/constants';

const Pill = ({ statuses }) => {
  const pills = [];
  statuses.forEach((status) => {
    switch (status) {
      case ARCHIVED:
        pills.push({
          text: 'Archived',
          className: 'badge badge-light',
        });
        break;
      case UNPUBLISHED:
        pills.push({
          text: 'Unsubmitted',
          className: 'badge badge-warning',
        });
        break;
      case REVIEWED:
        pills.push({
          text: 'Scheduled',
          className: 'badge badge-primary',
        });
        break;
      case REVIEW_BY_LEGAL:
      case REVIEW_BY_INTERNAL:
        pills.push({
          text: 'In review',
          className: 'badge badge-light',
        });
        pills.push({
          text: <i className="fa fa-lock" />,
        });
        break;
      case PUBLISHED:
        pills.push({
          text: 'Published',
          className: 'badge badge-success',
        });
        break;
      default:
        break;
    }
  });
  return pills.map(pill => (
    <span className={classNames('ml-2', pill.className)} key={pill.text}>
      {pill.text}
    </span>
  ));
};

Pill.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Pill;
