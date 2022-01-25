import React, { useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";
import PopoverDropdown from "components/PopoverDropdown";

import BookmarkTree from "./BookmarkTree";
import ImportFromFile from "./ImportFromFile";

import "./index.scss";

const ImportBookmark = () => {
  const [showBrowserModal, setShowBrowserModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);

  const toggleBrowserModal = () => {
    setShowBrowserModal(!showBrowserModal);
  };

  const toggleUploadModal = () => {
    setShowUploadModal(!showUploadModal);
  };

  const onSelectOption = (option) => {
    if (option.key === "FROM_BROWSER") {
      toggleBrowserModal();
    } else if (option.key === "FROM_FILE") {
      toggleUploadModal();
    }
  };

  return (
    <>
      <PopoverDropdown
        placement="bottom-end"
        isOpen={isOpenOptionPopper}
        setIsOpen={setIsOpenOptionPopper}
        onSelect={onSelectOption}
        options={[
          {
            key: "FROM_FILE",
            icon: "ri-file-line",
            label: "Import From File",
          },
          {
            key: "FROM_BROWSER",
            icon: "ri-window-line",
            label: "Import from Browser",
          },
        ]}
      >
        <Button link iconLeft="ri-download-2-line">
          Import
        </Button>
      </PopoverDropdown>

      <Modal open={showBrowserModal} onClose={toggleBrowserModal}>
        <BookmarkTree onClose={toggleBrowserModal} />
      </Modal>

      <Modal open={showUploadModal} onClose={toggleUploadModal}>
        <ImportFromFile onClose={toggleUploadModal} />
      </Modal>
    </>
  );
};

export default ImportBookmark;
