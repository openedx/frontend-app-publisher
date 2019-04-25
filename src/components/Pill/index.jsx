import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const Pill = ({ statuses }) => {
  const pills = [];
  statuses.forEach((status) => {
    switch (status) {
      case 'unpublished':
        pills.push({
          text: 'Incomplete',
          className: 'badge badge-danger',
        });
        break;
      case 'reviewed':
        pills.push({
          text: 'Scheduled',
          className: 'badge badge-primary',
        });
        break;
      case 'review_by_legal':
      case 'review_by_internal':
        pills.push({
          text: 'In review',
          className: 'badge badge-warning',
        });
        pills.push({
          text: <i className="fa fa-lock" />,
        });
        break;
      case 'published':
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
