import React, { useEffect } from "react";

import { useFormik } from "formik";

import Modal from "components/Modal";
import Button from "components/Button";
import Switch from "components/Switch";
import Select from "components/Select";
import FormGroup from "components/FormGroup";
import FormItem from "components/FormItem";
import { localGet, localSet } from "utils/chromeStorage";

const updateIntervalOptions = [
  {
    value: "MIN-15",
    label: "15 Min",
  },
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
];

const SyncSettingModal = ({ onClose }) => {
  const onSubmitData = (dataToSave) => {
    localSet({ syncSetting: dataToSave });
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit: onSubmitData,
  });

  const loadData = async () => {
    const settings = await localGet("syncSetting");
    formik.setValues(settings);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Modal.Header>Sync Setting</Modal.Header>
      <Modal.Body className="sync-setting-modal">
        <FormGroup
          values={formik.values}
          setValue={formik.setFieldValue}
          labelWidth={4}
        >
          <FormItem formKey="autoSync" label="Auto Sync" componentType="switch">
            <Switch />
          </FormItem>
          {formik.values?.autoSync ? (
            <FormItem formKey="syncInterval" label="Sync Interval">
              <Select options={updateIntervalOptions} />
            </FormItem>
          ) : null}
        </FormGroup>
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

export default SyncSettingModal;
