import React, { useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";
import IconSelector from "components/IconSelector";

import "./index.scss";

const DEFAULT_ICON = "ri-folder-line";

const NewGroupModal = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(DEFAULT_ICON);

  const reset = () => {
    setName("");
    setIcon(DEFAULT_ICON);
  };

  const close = () => {
    onClose();
    reset();
  };

  const onSubmit = () => {
    onConfirm({ name, icon });
    reset();
  };

  return (
    <Modal
      classNames={{ root: "new-group-modal" }}
      open={isOpen}
      onClose={close}
    >
      <Modal.Header>Create a new collection</Modal.Header>
      <Modal.Body>
        <div className="content">
          <IconSelector selectedIcon={icon} setSelectedIcon={setIcon} />
          <Input value={name} onChangeValue={setName} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSubmit}>Create</Button>
        <Button type="default" onClick={close}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewGroupModal;
