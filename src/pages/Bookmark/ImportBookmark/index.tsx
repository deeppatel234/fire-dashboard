import React, { useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";

import BookmarkTree from "./BookmarkTree";

import "./index.scss";

const ImportBookmark = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Button link iconLeft="ri-download-2-line" onClick={toggleModal}>Import</Button>
      <Modal open={showModal} onClose={toggleModal}>
        <BookmarkTree onClose={toggleModal} />
      </Modal>
    </>
  );
};

export default ImportBookmark;
