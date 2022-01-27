import React, { useContext, useMemo, useState } from "react";

import AppContext from "src/AppContext";
import PopoverDropdown from "components/PopoverDropdown";
import EventManager from "utils/EventManager";

const ImageOptions = () => {
  const { workspace } = useContext(AppContext);
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);

  const options = useMemo(() => {
    const op = [
      {
        key: "REFRESH",
        icon: "ri-refresh-line",
        label: "Refresh Image",
      },
    ];

    if (workspace?.settings?.home?.imageType === "UNSPLASH") {
      op.push({
        key: "SAVE_CUSTOM",
        icon: "ri-link-m",
        label: "Save as Custom URL",
      });
    }

    return op;
  }, [workspace]);

  const onSelectOption = (option) => {
    if (option.key === "REFRESH") {
      EventManager.emit("refreshImage");
    } else if (option.key === "SAVE_CUSTOM") {
      EventManager.emit("saveToCustomUrl");
    }
  };

  return (
    <PopoverDropdown
      placement="top-end"
      isOpen={isOpenOptionPopper}
      setIsOpen={setIsOpenOptionPopper}
      onSelect={onSelectOption}
      options={options}
    >
      <div className="image-options">
        <i className="ri-image-line" />
      </div>
    </PopoverDropdown>
  );
};

export default ImageOptions;
