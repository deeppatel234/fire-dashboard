import React from "react";

import { useFormik } from "formik";


import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";

import IconSelector from "components/IconSelector";

import WorkspaceService from "../../services/WorkspaceModal";

import "./index.scss";

const WorkspaceModal = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      icon: "ri-user-line",
    },
    onSubmit: (values) => {
      WorkspaceService.insert(values);
    },
  });

  return (
    <>
      <Modal.Header>Add Workspace</Modal.Header>
      <Modal.Body className="workspace-modal-wrapper">
        <div className="workspace-basic">
          <IconSelector
            selectedIcon={formik.values.icon}
            setSelectedIcon={(val) => formik.setFieldValue("icon", val)}
          />
          <Input
            placeholder="Workspace Name"
            value={formik.values.name}
            onChangeValue={(val) => formik.setFieldValue("name", val)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={formik.handleSubmit}>Save</Button>
        <Button type="default">Cancel</Button>
      </Modal.Footer>
    </>
  );
};

export default WorkspaceModal;
