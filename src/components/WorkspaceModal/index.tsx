import React, { useContext, useState } from "react";
import _isEqual from "lodash/isEqual";
import { object, string, array, boolean } from "yup";
import { toast } from "react-toastify";
import classNames from "classnames";

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
import EventManager from "utils/EventManager";
import useFormError from "utils/useFormError";
import useConfirm from "components/Confirm/useConfirm";

import WorkspaceService from "../../services/WorkspaceModal";
import MultiImage from "./MultiImage";

import "./index.scss";

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

const validationSchema = object({
  name: string().required(),
  icon: string().required(),
  settings: object({
    general: object({
      defaultApp: string().required(),
      color: string().required(),
    }),
    bookmark: object({
      openInNewTab: boolean().required(),
    }),
    home: object({
      userName: string(),
      clockType: string().required(),
      showGreeting: boolean().required(),
      imageType: string().required(),
      imageConfig: object({
        customImageUrls: array().of(string()),
        unsplashCategories: array().of(string()),
        updateInterval: string(),
      }),
    }),
  }),
});

const WorkspaceModal = ({
  dataToEdit,
  onClose,
  showClose,
  onSuccess,
  showHeader,
}) => {
  const { updateWorkspace, setWorkSpace, workspaceList, removeWorkspace } =
    useContext(AppContext);
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState("GENERAL");
  const { onSubmitForm, showError } = useFormError();

  const onSubmitData = async (dataToSave) => {
    const { customImageUrls } = dataToSave.settings.home.imageConfig;
    dataToSave.settings.home.imageConfig.customImageUrls =
      customImageUrls.filter((i) => !!i);

    try {
      const response = await updateWorkspace(dataToSave);

      if (
        response.settings.home.imageType !==
          dataToEdit?.settings?.home?.imageType ||
        !_isEqual(
          response.settings.home.imageConfig,
          dataToEdit?.settings?.home?.imageConfig,
        )
      ) {
        EventManager.emit("refreshImage", response);
      }

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
      toast.error("Workspace settings not updated. please try again");
    }
  };

  const onClickDelete = async () => {
    const isConfirmed = await confirm({
      message: "Are you sure want to delete workspace?",
    });

    if (isConfirmed) {
      try {
        await removeWorkspace(dataToEdit);
        toast.success("Workspace deleted successfully");
        if (onSuccess) {
          onSuccess();
        }
        if (onClose) {
          onClose();
        }
      } catch (err) {
        toast.error("Unable to delete this workspace. please try again");
      }
    }
  };

  const formik = useFormik({
    initialValues: dataToEdit || WorkspaceService.getInitialValues(),
    onSubmit: onSubmitData,
    validationSchema,
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
          {({ onChangeValue, value }) => {
            return (
              <div className="theme-picker">
                {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                  <div
                    key={index}
                    className={classNames(
                      "picker-block",
                      `color-${index}-block`,
                      {
                        active: value === `color-${index}`,
                      },
                    )}
                    onClick={() => onChangeValue(`color-${index}`)}
                  >
                    <i className="icon ri-check-line" />
                  </div>
                ))}
              </div>
            );
          }}
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
          errors={formik.errors}
          showError={showError}
          setValue={formik.setFieldValue}
          labelWidth={3}
        >
          <div className="workspace-basic">
            <IconSelector
              selectedIcon={formik.values.icon}
              setSelectedIcon={(val) => formik.setFieldValue("icon", val)}
            />
            <FormItem formKey="name">
              <Input placeholder="Workspace Name" />
            </FormItem>
          </div>
          <div className="setting-body-wrapper">
            <Tabs list={menuItems} value={activeTab} onChange={setActiveTab} />
            {Object.keys(rendereds).map((key) => {
              return (
                <div
                  key={key}
                  className={classNames("setting-body", {
                    active: key === activeTab,
                  })}
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
          <Button onClick={onSubmitForm(formik.handleSubmit)}>
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
