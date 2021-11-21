import React, { useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";

import "./index.scss";

const NewGroupModal = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState("");

  const close = () => {
    setName("");
    onClose();
  };

  const onSubmit = () => {
    onConfirm({ name });
    setName("");
  };

  return (
    <Modal
      classNames={{ root: "new-group-modal" }}
      open={isOpen}
      onClose={close}
    >
      <Modal.Header>Create a new collection</Modal.Header>
      <Modal.Footer>
        <Input value={name} onChangeValue={setName} />
      </Modal.Footer>
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
