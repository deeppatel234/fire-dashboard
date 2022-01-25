import React, { useContext } from "react";

import { useFormik, FormikProvider } from "formik";

import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";
import Switch from "components/Switch";
import Radio from "components/Radio";
import RadioGroup from "components/RadioGroup";
import FormGroup from "components/FormGroup";
import FormItem from "components/FormItem";
import IconSelector from "components/IconSelector";
import AppContext from "src/AppContext";
import { routes } from "src/constants/routes";

import WorkspaceService from "../../services/WorkspaceModal";
import MultiImage from "./MultiImage";

import "./index.scss";

const defaultSettings = {
  name: "",
  icon: "ri-user-line",
  settings: {
    defaultApp: routes.HOME.key,
    home: {
      clockType: "12hr",
      showGreeting: true,
      showBgImage: true,
      bgConfig: {
        unsplashRendom: true,
      },
    },
    bookmark: {
      openInNewTab: true,
    },
  },
};

const WorkspaceModal = ({
  dataToEdit,
  onClose,
  showClose,
  onSuccess,
  showHeader,
}) => {
  const { updateWorkspace, setWorkSpace } = useContext(AppContext);

  const onSubmitData = async (dataToSave) => {
    const { imageUrls } = dataToSave.settings.home.bgConfig;
    dataToSave.settings.home.bgConfig.imageUrls = imageUrls.filter((i) => !!i);

    try {
      let response = null;
      if (dataToSave.id) {
        response = await WorkspaceService.update(dataToSave);
      } else {
        response = await WorkspaceService.add(dataToSave);
      }
      updateWorkspace(response);
      if (!dataToSave.id) {
        setWorkSpace(response);
      }
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const formik = useFormik({
    initialValues: dataToEdit || defaultSettings,
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
          <FormItem formKey="settings.defaultApp" label="Default App">
            <RadioGroup name="defaultApp">
              <Radio value={routes.HOME.key} label={routes.HOME.title} />
              <Radio
                value={routes.BOOKMARK.key}
                label={routes.BOOKMARK.title}
              />
            </RadioGroup>
          </FormItem>
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
                  <FormikProvider value={formik}>
                    <MultiImage
                      formKey="settings.home.bgConfig.imageUrls"
                      value={formik.values.settings.home.bgConfig.imageUrls}
                      setValue={formik.setFieldValue}
                    />
                  </FormikProvider>
                </>
              ) : null}
            </div>
          </div>
          <div className="setting-block">
            <div className="title">Bookmark</div>
            <div className="setting-content">
              <FormItem
                formKey="settings.bookmark.openInNewTab"
                label="Open url in new tab"
                componentType="switch"
              >
                <Switch />
              </FormItem>
            </div>
          </div>
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
