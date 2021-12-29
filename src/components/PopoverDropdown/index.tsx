import React from "react";

import Popover from "components/Popover";

import "./index.scss";

const PopoverDropdown = ({ isOpen, setIsOpen, children, options, placement }) => {
  const renderOptionPopover = () => {
    if (Array.isArray(options)) {
      return (
        <div className="dropdown-item-wrapper">
          {options.map((op, index) => {
            if (op.key === "LINE") {
              return <div key={`LINE-${index}`} className="line" />;
            }

            return (
              <div
                key={op.key}
                className={`dropdown-item ${op.className || ""}`}
              >
                <i className={`icon ${op.icon}`} />
                <div>{op.label}</div>
              </div>
            );
          })}
        </div>
      );
    }

    return options;
  };

  return (
    <Popover
      className="popover-dropdown"
      component={renderOptionPopover()}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      placement={placement}
      closeOnClick
    >
      {children}
    </Popover>
  );
};

PopoverDropdown.defaultProps = {
  placement: "bottom",
};

export default PopoverDropdown;
