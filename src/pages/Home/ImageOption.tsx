import React, { useState } from "react";

import PopoverDropdown from "components/PopoverDropdown";
import EventManager from "utils/EventManager";

const ImageOptions = () => {
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);

  const onSelectOption = (options) => {
    if (options.key === "REFRESH") {
      EventManager.emit("refreshImage");
    } else if (options.key === "SAVE_CUSTOM") {
      EventManager.emit("saveToCustomUrl");
    }
  };

  return (
    <PopoverDropdown
      placement="top-end"
      isOpen={isOpenOptionPopper}
      setIsOpen={setIsOpenOptionPopper}
      onSelect={onSelectOption}
      options={[
        {
          key: "REFRESH",
          icon: "ri-refresh-line",
          label: "Refresh Image",
        },
        {
          key: "SAVE_CUSTOM",
          icon: "ri-link-m",
          label: "Save as Custom URL",
        },
      ]}
    >
      <div className="image-options">
        <i className="ri-image-line" />
      </div>
    </PopoverDropdown>
  );
};

export default ImageOptions;
