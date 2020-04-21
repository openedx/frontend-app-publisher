import PropTypes from 'prop-types';
import React from 'react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import ActionButton from '../ActionButton';

import {
  REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, REVIEWED, UNPUBLISHED,
} from '../../data/constants';

class CourseRunSubmitButton extends React.Component {
  constructor(props) {
    super(props);
    this.submitLabel = this.submitLabel.bind(this);
  }

  submitLabel() {
    const {
      hasNonExemptChanges,
      status,
    } = this.props;
    const { administrator } = getAuthenticatedUser();

    if (administrator) {
      switch (status) {
        case REVIEW_BY_LEGAL:
          return 'Save & Send to PC Review';
        case REVIEW_BY_INTERNAL:
          return 'PC Review Complete';
        default:
          break;
      }
    }
    if (status === REVIEWED) {
      if (hasNonExemptChanges) {
        return 'Re-Submit Run for Review';
      }
      return 'Update Run';
    }
    return 'Submit Run for Review';
  }

  render() {
    const {
      disabled,
      onSubmit,
      submitting,
    } = this.props;

    return (
      <ActionButton
        disabled={disabled}
        onClick={onSubmit}
        labels={{
          default: this.submitLabel(),
          pending: 'Submitting Run for Review',
        }}
        state={submitting ? 'pending' : 'default'}
      />
    );
  }
}

CourseRunSubmitButton.propTypes = {
  disabled: PropTypes.bool,
  hasNonExemptChanges: PropTypes.bool,
  onSubmit: PropTypes.func,
  status: PropTypes.string,
  submitting: PropTypes.bool,
};

CourseRunSubmitButton.defaultProps = {
  disabled: false,
  hasNonExemptChanges: false,
  onSubmit: () => {},
  status: UNPUBLISHED,
  submitting: false,
};

export default CourseRunSubmitButton;
