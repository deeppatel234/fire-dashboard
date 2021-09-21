import React, { useContext } from "react";

import { useFormik } from "formik";

import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";
import Radio from "components/Radio";
import RadioGroup from "components/RadioGroup";

import IconSelector from "components/IconSelector";

import AppContext from "src/AppContext";

import WorkspaceService from "../../services/WorkspaceModal";

import "./index.scss";

const WorkspaceModal = ({ dataToEdit, onClose }) => {
  const { updateWorkspace } = useContext(AppContext);

  const onSubmitData = async (dataToSave) => {
    try {
      const response = await WorkspaceService.put(dataToSave);
      updateWorkspace(response);
      onClose();
    } catch (err) {
      console.log("err", err);
    }
  };

  const formik = useFormik({
    initialValues: dataToEdit || {
      name: "",
      icon: "ri-user-line",
    },
    onSubmit: onSubmitData,
  });

  return (
    <>
      <Modal.Header>{dataToEdit ? "Settings" : "Add Workspace"}</Modal.Header>
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
        <div className="setting-block">
          <div className="title">Home</div>
          <div className="setting-content">
            <RadioGroup
              name="clockType"
              value={formik.values?.settings?.home?.clockType}
              onChangeValue={(val) =>
                formik.setFieldValue("settings.home.clockType", val)
              }
            >
              <Radio value="12hr" label="12 Hr" />
              <Radio value="24hr" label="24 Hr" />
            </RadioGroup>
          </div>
        </div>
        <div className="setting-block">
          <div className="title">Bookmark</div>
          <div className="setting-content">Bookmark settings</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={formik.handleSubmit}>Save</Button>
        <Button type="default" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );
};

export default WorkspaceModal;
