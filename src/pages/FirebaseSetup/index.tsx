import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import Button from "components/Button";
import Input from "components/Input";
import FormGroup from "components/FormGroup";
import FormItem from "components/FormItem";
import AppContext from "src/AppContext";

import firebase from "../../services/firebase";

import ServerSvg from "./ServerSvg";

import "./index.scss";

const FirebaseSetup = () => {
  const { createAndLoadFirstWorkspace } = useContext(AppContext);
  const history = useHistory();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = useMemo(() => {
    return params?.mode === "edit";
  }, [params]);

  const goToHome = () => {
    if (isEditMode) {
      history.goBack();
    } else {
      createAndLoadFirstWorkspace();
      history.push("/");
    }
  };

  const onSubmitData = async (data) => {
    setIsLoading(true);
    try {
      await firebase.test(data);
      await firebase.setConfig(data);
      goToHome();
    } catch (err) {
      toast.error("Please verify your firebase account data");
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    onSubmit: onSubmitData,
  });

  const setInitConfig = async () => {
    const config = await firebase.getConfig();
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
            setValue={formik.setFieldValue}
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
              </div>
            </div>
          </FormGroup>
          <div className="footer">
            <Button
              onClick={formik.handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Save
            </Button>
            <Button onClick={goToHome} link disabled={isLoading}>
              {isEditMode ? "Close" : "Skip"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetup;
