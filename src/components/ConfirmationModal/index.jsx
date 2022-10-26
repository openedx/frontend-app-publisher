import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from '@edx/paragon';

const ConfirmationModal = ({
  onSubmit,
  title,
  body,
  buttonLabel,
  ...passThroughProps
}) => (
  <Modal
    {...passThroughProps}
    title={title}
    body={body}
    closeText="Cancel"
    buttons={[
      {
        label: buttonLabel,
        buttonType: 'primary',
        onClick: onSubmit,
      },
    ]}
  />
);

ConfirmationModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default ConfirmationModal;
