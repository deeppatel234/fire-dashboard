import React, { useEffect } from "react";

import { useFormik } from "formik";
import { object, string, boolean } from "yup";

import Modal from "components/Modal";
import Button from "components/Button";
import FormGroup from "components/FormGroup";
import FormItem from "components/FormItem";
import Input from "components/Input";
import Switch from "components/Switch";
import useFormError from "utils/useFormError";

import "./index.scss";

const validationSchema = object({
  title: string().required("Title is required field"),
  url: string().required("Url is required field"),
  pinned: boolean().required("Pinned is required field"),
});

const BookmarkEditModal = ({ isOpen, onClose, onConfirm, dataToUpdate }) => {
  const { onSubmitForm, showError } = useFormError();

  const onSubmitData = async (dataToSave) => {
    onConfirm(dataToSave);
  };

  const formik = useFormik({
    initialValues: dataToUpdate,
    onSubmit: onSubmitData,
    validationSchema,
  });

  const reset = () => {
    formik.setValues(dataToUpdate);
  };

  useEffect(() => {
    reset();
  }, [dataToUpdate]);

  const close = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      classNames={{ root: "new-bookmark-modal" }}
      open={isOpen}
      onClose={close}
    >
      <Modal.Header>Update Bookmark</Modal.Header>
      <Modal.Body>
        <FormGroup
          labelWidth={3}
          values={formik.values}
          errors={formik.errors}
          setValue={formik.setFieldValue}
          showError={showError}
        >
          <FormItem formKey="title" label="Title" componentType="input">
            <Input />
          </FormItem>
          <FormItem formKey="url" label="URL" componentType="input">
            <Input />
          </FormItem>
          <FormItem formKey="pinned" label="Tab Pinned" componentType="switch">
            <Switch />
          </FormItem>
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSubmitForm(formik.handleSubmit)}>Update</Button>
        <Button type="default" onClick={close}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookmarkEditModal;
