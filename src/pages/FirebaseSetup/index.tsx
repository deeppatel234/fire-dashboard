import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { object, string } from "yup";

import Button from "components/Button";
import Input from "components/Input";
import FormGroup from "components/FormGroup";
import FormItem from "components/FormItem";
import AppContext from "src/AppContext";
import useConfirm from "components/Confirm/useConfirm";
import { localRemoveModalSyncTime, localSet } from "utils/chromeStorage";
import useChromeSync from "utils/useChromeSync";
import useFormError from "utils/useFormError";
import firebase from "services/firebase";

import ServerSvg from "./ServerSvg";

import "./index.scss";

const validationSchema = object({
  projectId: string().required("Project Id is required field"),
  apiKey: string().required("API Key is required field"),
});

const FirebaseSetup = () => {
  const { confirm } = useConfirm();
  const { createAndLoadFirstWorkspace, loadWorkspaces } =
    useContext(AppContext);
  const history = useHistory();
  const params = useParams();
  const { onSubmitForm, showError } = useFormError();
  const [currentConfig, setCurrentConfig] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSyncComplete = () => {
    goToHome(true);
  };

  const { isSyncInProgress, startSync } = useChromeSync({ onSyncComplete });

  const isEditMode = useMemo(() => {
    return params?.mode === "edit";
  }, [params]);

  const goToHome = (refreshWorkspace) => {
    if (refreshWorkspace) {
      loadWorkspaces();
    }
    if (isEditMode) {
      history.goBack();
    } else {
      try {
        if (!refreshWorkspace) {
          createAndLoadFirstWorkspace();
        }
        history.push("/");
      } catch (err) {
        toast.error("Unable to create your first workspace. please try again");
      }
    }
  };

  const onSubmitData = async (data) => {
    if (
      currentConfig.projectId === data.projectId &&
      currentConfig.apiKey === data.apiKey
    ) {
      goToHome();
      return;
    }

    setIsLoading(true);
    try {
      await firebase.test(data);

      await localRemoveModalSyncTime();

      await firebase.setConfig(data);

      await localSet({
        syncSetting: {
          autoSync: true,
          syncInterval: 6 * 60, // 6 hr
        },
      });

      const hasBackup = firebase.hasBackup(data);

      if (hasBackup) {
        const isConfirmed = await confirm({
          title: "Backup Found",
          message: "Are you sure want to use this backup data?",
        });

        if (isConfirmed) {
          startSync();
          return;
        }
      }

      await firebase.deleteAllWorkspace();

      goToHome();
    } catch (err) {
      toast.error("Please verify your firebase account data");
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      projectId: "",
      apiKey: "",
    },
    onSubmit: onSubmitData,
    validationSchema,
  });

  const setInitConfig = async () => {
    const config = await firebase.getConfig();
    setCurrentConfig(config);
    formik.setValues(config);
  };

  useEffect(() => {
    setInitConfig();
  }, []);

  return (
    <div className="firebase-setup-wrapper">
      <div className="svg-image col-md-6">
        <ServerSvg />
      </div>
      <div className="form-content col-md-6">
        <div className="onboarding-title">
          {isEditMode
            ? "Firebase sync configuration"
            : "Sync your data with firebase"}
        </div>
        <div className="setup-modal">
          <FormGroup
            values={formik.values}
            errors={formik.errors}
            setValue={formik.setFieldValue}
            showError={showError}
            labelWidth={3}
          >
            <div className="setting-block">
              <div className="setting-content">
                <FormItem
                  formKey="projectId"
                  label="Project Id"
                  componentType="input"
                >
                  <Input />
                </FormItem>
                <FormItem
                  formKey="apiKey"
                  label="API Key"
                  componentType="input"
                >
                  <Input />
                </FormItem>
                <div className="account-info">
                  Your firebase account data is stored in your browser only.
                </div>
                {isSyncInProgress ? (
                  <div className="account-info">
                    Please do not close this window while sync.
                  </div>
                ) : null}
              </div>
            </div>
          </FormGroup>
          <div className="footer">
            <Button
              onClick={onSubmitForm(formik.handleSubmit)}
              isLoading={isLoading || isSyncInProgress}
              disabled={isLoading || isSyncInProgress}
            >
              {isSyncInProgress ? "Sync Data" : "Save"}
            </Button>
            <Button
              onClick={() => goToHome()}
              link
              disabled={isLoading || isSyncInProgress}
            >
              {isEditMode ? "Close" : "Skip"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetup;
