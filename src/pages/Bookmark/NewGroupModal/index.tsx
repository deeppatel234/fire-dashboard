import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";
import IconSelector from "components/IconSelector";

import "./index.scss";

const DEFAULT_ICON = "ri-folder-line";

const NewGroupModal = ({ isOpen, onClose, onConfirm, dataToUpdate }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(DEFAULT_ICON);

  const reset = () => {
    if (dataToUpdate) {
      setName(dataToUpdate.name || "");
      setIcon(dataToUpdate.icon || DEFAULT_ICON);
    } else {
      setName("");
      setIcon(DEFAULT_ICON);
    }
  };

  useEffect(() => {
    reset();
  }, [dataToUpdate]);

  const close = () => {
    onClose();
    reset();
  };

  const onSubmit = () => {
    if (name) {
      onConfirm({ name, icon });
      reset();
    } else {
      toast.error("Please enter collection name");
    }
  };

  return (
    <Modal
      classNames={{ root: "new-group-modal" }}
      open={isOpen}
      onClose={close}
    >
      <Modal.Header>
        {dataToUpdate ? "Update Collection Title" : "Create a new collection"}
      </Modal.Header>
      <Modal.Body>
        <div className="content">
          <IconSelector selectedIcon={icon} setSelectedIcon={setIcon} />
          <Input value={name} onChangeValue={setName} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSubmit}>{dataToUpdate ? "Update" : "Create"}</Button>
        <Button type="default" onClick={close}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewGroupModal;
