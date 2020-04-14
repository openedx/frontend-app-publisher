import PropTypes from 'prop-types';
import React from 'react';

import ButtonToolbar from '../ButtonToolbar';
import CourseRunSubmitButton from './CourseRunSubmitButton';

import { PUBLISHED, UNPUBLISHED } from '../../data/constants';

function CourseRunButtonToolbar(props) {
  const {
    className,
    disabled,
    editable,
    hasNonExemptChanges,
    onSubmit,
    pristine,
    status,
    submitting,
  } = props;

  if (!editable) {
    return null;
  }

  if (status === PUBLISHED) {
    if (pristine) {
      return null;
    }
    return (
      <div className="font-italic text-center">
        To publish changes, click ‘Save & Re-Publish’ below.
      </div>
    );
  }

  return (
    <ButtonToolbar className={className}>
      <CourseRunSubmitButton
        disabled={disabled}
        hasNonExemptChanges={hasNonExemptChanges}
        onSubmit={onSubmit}
        status={status}
        submitting={submitting}
      />
    </ButtonToolbar>
  );
}

CourseRunButtonToolbar.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  hasNonExemptChanges: PropTypes.bool,
  onSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  status: PropTypes.string,
  submitting: PropTypes.bool,
};

CourseRunButtonToolbar.defaultProps = {
  className: '',
  disabled: false,
  editable: false,
  hasNonExemptChanges: false,
  onSubmit: () => {},
  pristine: false,
  status: UNPUBLISHED,
  submitting: false,
};

export default CourseRunButtonToolbar;
