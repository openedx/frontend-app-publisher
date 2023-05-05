import React from 'react';
import PropTypes from 'prop-types';

import { ActionRow, Button, ModalDialog } from '@edx/paragon';

const ConfirmationModal = ({
  onSubmit,
  title,
  body,
  buttonLabel,
  open,
  ...passThroughProps
}) => (
  <ModalDialog
    isOpen={open}
    {...passThroughProps}
    hasCloseButton
  >
    <ModalDialog.Header>
      <ModalDialog.Title>
        {title}
      </ModalDialog.Title>
    </ModalDialog.Header>
    <ModalDialog.Body>
      <div className="p-1">
        {body}
      </div>
    </ModalDialog.Body>
    <ModalDialog.Footer>
      <ActionRow>
        <ModalDialog.CloseButton variant="link">
          Cancel
        </ModalDialog.CloseButton>
        <Button
          variant="primary"
          onClick={onSubmit}
        >
          {buttonLabel}
        </Button>
      </ActionRow>
    </ModalDialog.Footer>

  </ModalDialog>
);

ConfirmationModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

export default ConfirmationModal;
