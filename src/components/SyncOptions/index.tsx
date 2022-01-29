import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";

import PopoverDropdown from "components/PopoverDropdown";
import Modal from "components/Modal";

import useChromeSync from "utils/useChromeSync";
import { localGet } from "utils/chromeStorage";
import SyncSettingModal from "./SyncSettingModal";

import "./index.scss";

const SyncOptions = () => {
  const history = useHistory();
  const { isSyncInProgress, startSync } = useChromeSync();
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [isSyncAllowed, setIsSyncAllowed] = useState(false);

  const checkSyncAllowed = async () => {
    const config = await localGet(["firebaseProjectId", "firebaseApiKey"]);

    setIsSyncAllowed(!!config?.firebaseProjectId && !!config?.firebaseApiKey);
  };

  useEffect(() => {
    checkSyncAllowed();
  }, []);

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
            disabled: !isSyncAllowed,
            disableTooltip:
              "Please add firebase config for enable this feature",
            tooltipPlacement: "left",
          },
          {
            key: "SYNC_SETTING",
            icon: "ri-settings-3-line",
            label: "Sync Settings",
            disabled: !isSyncAllowed,
            disableTooltip:
              "Please add firebase config for enable this feature",
            tooltipPlacement: "left",
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
            className={classNames("sync-icon-menu ri-refresh-line", {
              spin: isSyncInProgress,
            })}
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
