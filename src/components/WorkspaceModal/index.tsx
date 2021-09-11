import React from "react";

import Modal from "components/Modal";
import Button from "components/Button";

import "./index.scss";

const WorkspaceModal = () => {
  return (
    <>
      <Modal.Header>Add Workspace</Modal.Header>
      <Modal.Body>hello</Modal.Body>
      <Modal.Footer>
        <Button>Save</Button>
        <Button type="default">Cancel</Button>
      </Modal.Footer>
    </>
  );
};

export default WorkspaceModal;
