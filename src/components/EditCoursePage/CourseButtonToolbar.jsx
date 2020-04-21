import PropTypes from 'prop-types';
import React from 'react';

import ActionButton from '../ActionButton';
import ButtonToolbar from '../ButtonToolbar';

function CourseButtonToolbar(props) {
  const {
    className,
    disabled,
    editable,
    onClear,
    onSave,
    pristine,
    publishedContentChanged,
    submitting,
  } = props;

  if (!editable) {
    return null;
  }

  let saveState = 'default';
  if (submitting) {
    saveState = 'pending';
  } else if (pristine) {
    saveState = 'complete';
  } else if (publishedContentChanged) {
    saveState = 'republish';
  }

  return (
    <ButtonToolbar className={className}>
      {!submitting && !pristine
      && (
        <button
          className="btn btn-outline-primary"
          disabled={disabled}
          onClick={onClear}
          type="button"
        >
          Clear Edits
        </button>
      )}
      <ActionButton
        disabled={disabled}
        labels={{
          default: 'Save & Continue Editing',
          republish: 'Save & Re-Publish',
          pending: 'Saving Course',
          complete: 'Course Saved',
        }}
        state={saveState}
        onClick={onSave}
      />
    </ButtonToolbar>
  );
}

CourseButtonToolbar.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  onClear: PropTypes.func,
  onSave: PropTypes.func,
  pristine: PropTypes.bool,
  publishedContentChanged: PropTypes.bool,
  submitting: PropTypes.bool,
};

CourseButtonToolbar.defaultProps = {
  className: '',
  disabled: false,
  editable: false,
  onClear: () => {},
  onSave: () => {},
  pristine: false,
  publishedContentChanged: false,
  submitting: false,
};

export default CourseButtonToolbar;
