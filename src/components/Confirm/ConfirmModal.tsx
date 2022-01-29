import React, { useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";

import ConfirmContext from "./ConfirmContext";

import "./index.scss";

const ConfirmModal = ({ children }) => {
  const [dialogConfig, setDialogConfig] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = ({
    title = "Confirmation",
    message,
    actionCallback,
    actionText = "Yes",
    dismissText = "No",
    showActionBtn = true,
    showDismissBtn = true,
    beforeConfirm,
  }) => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      actionCallback,
      actionText,
      dismissText,
      showActionBtn,
      showDismissBtn,
      beforeConfirm,
    });
  };

  const resetDialog = () => {
    setDialogConfig({});
  };

  const onConfirm = async () => {
    if (dialogConfig.beforeConfirm) {
      setIsLoading(true);
      try {
        await dialogConfig.beforeConfirm();
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        return false;
      }
    }

    resetDialog();
    dialogConfig.actionCallback(true);
  };

  const onDismiss = () => {
    resetDialog();
    dialogConfig.actionCallback(false);
  };

  return (
    <ConfirmContext.Provider value={{ openDialog }}>
      <Modal
        open={dialogConfig.isOpen}
        onClose={onDismiss}
        showCloseIcon={false}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <Modal.Header>{dialogConfig.title}</Modal.Header>
        <Modal.Body className="confirmation-modal-body">
          {dialogConfig.message}
        </Modal.Body>
        <Modal.Footer>
          {dialogConfig.showActionBtn ? (
            <Button
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {dialogConfig.actionText}
            </Button>
          ) : null}
          {dialogConfig.showDismissBtn ? (
            <Button type="default" onClick={onDismiss} disabled={isLoading}>
              {dialogConfig.dismissText}
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
      {children}
    </ConfirmContext.Provider>
  );
};

export default ConfirmModal;
