import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from '@edx/paragon';


const SubmitConfirmModal = ({
  onSubmit,
  ...passThroughProps
}) => (
  <Modal
    {...passThroughProps}
    title="Submit for Review?"
    body="You will not be able to make edits while the course is in review, which can take up to 48 hours. Confirm your edits are complete."
    buttons={[
      {
        label: 'Submit',
        buttonType: 'primary',
        onClick: onSubmit,
      },
    ]}
  />
);

SubmitConfirmModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SubmitConfirmModal;
