import React, { useContext, useState } from "react";

import { useFormik, FormikProvider } from "formik";

import Modal from "components/Modal";
import Button from "components/Button";
import Input from "components/Input";
import Switch from "components/Switch";
import Radio from "components/Radio";
import Select from "components/Select";
import RadioGroup from "components/RadioGroup";
import FormGroup from "components/FormGroup";
import FormItem from "components/FormItem";
import Tabs from "components/Tabs";
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
    general: {
      defaultApp: routes.HOME.key,
      color: "color-1",
    },
    home: {
      userName: "",
      clockType: "12hr",
      showGreeting: true,
      imageType: "DEFAULT",
      imageConfig: {
        customImageUrls: [],
        unsplashCategories: ["nature"],
        updateInterval: "DAY-1",
      },
    },
    bookmark: {
      openInNewTab: true,
    },
  },
};

const menuItems = [
  {
    value: "GENERAL",
    label: "General",
    icon: "ri-user-settings-line",
  },
  {
    value: "HOME",
    label: "Home",
    icon: "ri-home-line",
  },
  {
    value: "BOOKMARK",
    label: "Bookmark",
    icon: "ri-bookmark-line",
  },
];

const unsplashCategories = [
  { label: "3D Renders", value: "3d-renders" },
  { label: "Textures Patterns", value: "textures-patterns" },
  { label: "Architecture", value: "architecture" },
  { label: "Experimental", value: "experimental" },
  { label: "Nature", value: "nature" },
  { label: "Business Work", value: "business-work" },
  { label: "Fashion", value: "fashion" },
  { label: "Film", value: "film" },
  { label: "Food Drink", value: "food-drink" },
  { label: "Health", value: "health" },
  { label: "People", value: "people" },
  { label: "Interiors", value: "interiors" },
  { label: "Street Photography", value: "street-photography" },
  { label: "Travel", value: "travel" },
  { label: "Animals", value: "animals" },
  { label: "Spirituality", value: "spirituality" },
  { label: "Arts Culture", value: "arts-culture" },
  { label: "History", value: "history" },
  { label: "Athletics", value: "athletics" },
  { label: "Water", value: "water" },
  { label: "Travel", value: "travel" },
];

const imageTypes = [
  {
    label: "Default",
    value: "DEFAULT",
  },
  {
    label: "No Image",
    value: "NO_IMAGE",
  },
  {
    label: "Rendom Image from Unsplash",
    value: "UNSPLASH",
  },
  {
    label: "Custom Images",
    value: "CUSTOM",
  },
];

const updateIntervalOptions = [
  {
    value: "MIN-30",
    label: "30 Min",
  },
  {
    value: "HR-1",
    label: "1 Hr",
  },
  {
    value: "HR-3",
    label: "3 Hr",
  },
  {
    value: "HR-6",
    label: "6 Hr",
  },
  {
    value: "HR-9",
    label: "9 Hr",
  },
  {
    value: "HR-12",
    label: "12 Hr",
  },
  {
    value: "DAY-1",
    label: "Every Day",
  },
  {
    value: "WEEK-1",
    label: "Every Week",
  },
  {
    value: "MONTH-1",
    label: "Every Month",
  },
];

const WorkspaceModal = ({
  dataToEdit,
  onClose,
  showClose,
  onSuccess,
  showHeader,
}) => {
  const { updateWorkspace, setWorkSpace, workspaceList, removeWorkspace } =
    useContext(AppContext);
  const [activeTab, setActiveTab] = useState("GENERAL");

  const onSubmitData = async (dataToSave) => {
    const { customImageUrls } = dataToSave.settings.home.imageConfig;
    dataToSave.settings.home.imageConfig.customImageUrls =
      customImageUrls.filter((i) => !!i);

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

  const onClickDelete = () => {
    removeWorkspace(dataToEdit);
    if (onSuccess) {
      onSuccess();
    }
    if (onClose) {
      onClose();
    }
  };

  const formik = useFormik({
    initialValues: dataToEdit || defaultSettings,
    onSubmit: onSubmitData,
  });

  const renderGeneral = () => {
    return (
      <>
        <FormItem formKey="settings.general.defaultApp" label="Default App">
          <RadioGroup name="defaultApp">
            <Radio value={routes.HOME.key} label={routes.HOME.title} />
            <Radio value={routes.BOOKMARK.key} label={routes.BOOKMARK.title} />
          </RadioGroup>
        </FormItem>
        <FormItem formKey="settings.general.color" label="Theme">
          <div className="theme-picker">
            {[1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div
                key={index}
                className={`picker-block color-${index}-block ${
                  formik.values?.settings?.general?.color === `color-${index}`
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  formik.setFieldValue(
                    "settings.general.color",
                    `color-${index}`,
                  )
                }
              >
                <i className="icon ri-check-line" />
              </div>
            ))}
          </div>
        </FormItem>
      </>
    );
  };

  const renderHome = () => {
    return (
      <>
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
        <FormItem formKey="settings.home.imageType" label="Background Image">
          <Select options={imageTypes} />
        </FormItem>
        {formik.values?.settings?.home?.imageType === "CUSTOM" ? (
          <FormikProvider value={formik}>
            <MultiImage
              formKey="settings.home.imageConfig.customImageUrls"
              value={formik.values.settings.home.imageConfig.customImageUrls}
              setValue={formik.setFieldValue}
            />
          </FormikProvider>
        ) : null}
        {formik.values?.settings?.home?.imageType === "UNSPLASH" ? (
          <FormItem
            formKey="settings.home.imageConfig.unsplashCategories"
            label="Image Categories"
          >
            <Select isMulti options={unsplashCategories} />
          </FormItem>
        ) : null}
        {["UNSPLASH", "CUSTOM"].includes(
          formik.values?.settings?.home?.imageType,
        ) ? (
          <FormItem
            formKey="settings.home.imageConfig.updateInterval"
            label="Image Update Interval"
          >
            <Select options={updateIntervalOptions} />
          </FormItem>
        ) : null}
      </>
    );
  };

  const renderBookmark = () => {
    return (
      <FormItem
        formKey="settings.bookmark.openInNewTab"
        label="Open url in new tab"
        componentType="switch"
      >
        <Switch />
      </FormItem>
    );
  };

  const rendereds = {
    GENERAL: renderGeneral,
    HOME: renderHome,
    BOOKMARK: renderBookmark,
  };

  return (
    <>
      {showHeader ? (
        <Modal.Header>{dataToEdit ? "Settings" : "Add Workspace"}</Modal.Header>
      ) : null}
      <Modal.Body className="workspace-modal-wrapper">
        <FormGroup
          values={formik.values}
          setValue={formik.setFieldValue}
          labelWidth={3}
        >
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
          <div className="setting-body-wrapper">
            <Tabs list={menuItems} value={activeTab} onChange={setActiveTab} />
            {Object.keys(rendereds).map((key) => {
              return (
                <div
                  key={key}
                  className={`setting-body ${
                    key === activeTab ? "active" : ""
                  }`}
                >
                  {rendereds[key]()}
                </div>
              );
            })}
          </div>
        </FormGroup>
      </Modal.Body>
      <Modal.Footer className="space">
        <div className="left">
          {dataToEdit && workspaceList?.length > 1 ? (
            <Button
              iconLeft="ri-delete-bin-7-line"
              type="danger"
              onClick={onClickDelete}
              outline
            >
              Delete
            </Button>
          ) : null}
        </div>
        <div className="right">
          <Button onClick={formik.handleSubmit}>
            {dataToEdit ? "Save" : "Create"}
          </Button>
          {showClose ? (
            <Button type="default" onClick={onClose}>
              Cancel
            </Button>
          ) : null}
        </div>
      </Modal.Footer>
    </>
  );
};

WorkspaceModal.defaultProps = {
  showClose: true,
  showHeader: true,
};

export default WorkspaceModal;
