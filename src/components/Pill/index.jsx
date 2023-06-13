import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

import {
  REVIEW_BY_LEGAL,
  REVIEW_BY_INTERNAL,
  PUBLISHED,
  REVIEWED,
  UNPUBLISHED,
  ARCHIVED,
} from '../../data/constants';

const Pill = ({ statuses }) => {
  const { formatMessage } = useIntl();

  const pills = [];
  statuses.forEach((status) => {
    switch (status) {
      case ARCHIVED:
        pills.push({
          text: formatMessage(messages.statusArchived),
          className: 'badge badge-secondary',
        });
        break;
      case UNPUBLISHED:
        pills.push({
          text: formatMessage(messages.statusUnsubmitted),
          className: 'badge badge-warning',
        });
        break;
      case REVIEWED:
        pills.push({
          text: formatMessage(messages.statusScheduled),
          className: 'badge badge-primary',
        });
        break;
      case REVIEW_BY_LEGAL:
      case REVIEW_BY_INTERNAL:
        pills.push({
          text: formatMessage(messages.statusInReview),
          className: 'badge badge-light',
        });
        pills.push({
          text: <i className="fa fa-lock" />,
        });
        break;
      case PUBLISHED:
        pills.push({
          text: formatMessage(messages.statusPublished),
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
