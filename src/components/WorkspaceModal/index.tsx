import React from "react";

import Modal from "components/Modal";
import Button from "components/Button";
import IconSelector from "components/IconSelector";

import "./index.scss";

const WorkspaceModal = () => {
  return (
    <>
      <Modal.Header>Add Workspace</Modal.Header>
      <Modal.Body>
        <IconSelector />
      </Modal.Body>
      <Modal.Footer>
        <Button>Save</Button>
        <Button type="default">Cancel</Button>
      </Modal.Footer>
    </>
  );
};

export default WorkspaceModal;
