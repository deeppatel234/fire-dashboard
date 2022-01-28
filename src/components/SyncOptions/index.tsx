import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import PopoverDropdown from "components/PopoverDropdown";
import Modal from "components/Modal";

import useChromeSync from "utils/useChromeSync";
import SyncSettingModal from "./SyncSettingModal";

import "./index.scss";

const SyncOptions = () => {
  const history = useHistory();
  const { isSyncInProgress, startSync } = useChromeSync();
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);

  const toggleSettingModal = () => {
    setShowSettingModal(!showSettingModal);
  };

  const onSelectOption = (option) => {
    if (!isSyncInProgress && option.key === "SYNC_NOW") {
      startSync();
    } else if (option.key === "SYNC_SETTING") {
      toggleSettingModal();
    } else if (option.key === "FIREBASE_CONFIGURATION") {
      history.push("/firebase/edit");
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
            key: "SYNC_NOW",
            icon: "ri-refresh-line",
            label: "Sync Now",
          },
          {
            key: "SYNC_SETTING",
            icon: "ri-settings-3-line",
            label: "Sync Settings",
          },
          {
            key: "FIREBASE_CONFIGURATION",
            icon: "ri-fire-line",
            label: "Firebase Configuration",
          },
        ]}
      >
        <a>
          <i
            className={`sync-icon-menu ri-refresh-line ${
              isSyncInProgress ? "spin" : ""
            }`}
          />
        </a>
      </PopoverDropdown>
      <Modal open={showSettingModal} onClose={toggleSettingModal}>
        <SyncSettingModal onClose={toggleSettingModal} />
      </Modal>
    </>
  );
};

export default SyncOptions;
