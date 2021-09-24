import React, { useContext } from "react";

import { useFormik } from "formik";

import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";
import Textarea from "components/Textarea";
import Switch from "components/Switch";
import Radio from "components/Radio";
import RadioGroup from "components/RadioGroup";
import FormGroup from "components/FormGroup";
import FormItem from "components/FormItem";

import IconSelector from "components/IconSelector";

import AppContext from "src/AppContext";

import WorkspaceService from "../../services/WorkspaceModal";

import "./index.scss";

const WorkspaceModal = ({
  dataToEdit,
  onClose,
  showClose,
  onSuccess,
  showHeader,
}) => {
  const { updateWorkspace } = useContext(AppContext);

  const onSubmitData = async (dataToSave) => {
    try {
      const response = await WorkspaceService.put(dataToSave);
      updateWorkspace(response);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.log("err", err);
    }
  };

  const formik = useFormik({
    initialValues: dataToEdit || {
      name: "",
      icon: "ri-user-line",
      settings: {
        home: {
          clockType: "12hr",
          showGreeting: true,
          showBgImage: true,
          bgConfig: {
            unsplashRendom: true,
          },
        },
      },
    },
    onSubmit: onSubmitData,
  });

  return (
    <>
      {showHeader ? (
        <Modal.Header>{dataToEdit ? "Settings" : "Add Workspace"}</Modal.Header>
      ) : null}
      <Modal.Body className="workspace-modal-wrapper">
        <FormGroup values={formik.values} setValue={formik.setFieldValue}>
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
              <FormItem
                formKey="settings.home.userName"
                label="Your Name"
                componentType="input"
              >
                <Input />
              </FormItem>
              <FormItem formKey="settings.home.clockType" label="Clock Type">
                <RadioGroup name="clockType">
                  <Radio value="12hr" label="12 Hr" />
                  <Radio value="24hr" label="24 Hr" />
                </RadioGroup>
              </FormItem>
              <FormItem
                formKey="settings.home.showGreeting"
                label="Show Greeting"
                componentType="switch"
              >
                <Switch />
              </FormItem>
              <FormItem
                formKey="settings.home.showBgImage"
                label="Show Image"
                componentType="switch"
              >
                <Switch />
              </FormItem>
              {formik.values?.settings?.home?.showBgImage ? (
                <>
                  <FormItem
                    formKey="settings.home.bgConfig.unsplashRendom"
                    label="Rendom Image from Unsplash"
                    componentType="switch"
                  >
                    <Switch />
                  </FormItem>
                  <FormItem
                    formKey="settings.home.bgConfig.imageUrls[2]"
                    label="Custom Image Urls"
                  >
                    <Textarea className="url-textarea" />
                  </FormItem>
                </>
              ) : null}
            </div>
          </div>
          {/* <div className="setting-block">
            <div className="title">Bookmark</div>
            <div className="setting-content">Bookmark settings</div>
          </div> */}
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={formik.handleSubmit}>
          {dataToEdit ? "Save" : "Create"}
        </Button>
        {showClose ? (
          <Button type="default" onClick={onClose}>
            Cancel
          </Button>
        ) : null}
      </Modal.Footer>
    </>
  );
};

WorkspaceModal.defaultProps = {
  showClose: true,
  showHeader: true,
};

export default WorkspaceModal;
