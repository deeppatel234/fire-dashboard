import React from "react";
import Tippy from "@tippyjs/react";

import Popover from "components/Popover";

import "./index.scss";

const PopoverDropdown = ({
  isOpen,
  setIsOpen,
  children,
  options,
  placement,
  onSelect,
}) => {
  const renderOptionPopover = () => {
    if (Array.isArray(options)) {
      return (
        <div className="dropdown-item-wrapper">
          {options.map((op, index) => {
            if (op.key === "LINE") {
              return <div key={`LINE-${index}`} className="line" />;
            }

            const content = (
              <div
                key={op.key}
                className={`dropdown-item ${op.className || ""} ${
                  op.disabled ? "disabled" : ""
                }`}
                onClick={() => onSelect(op)}
              >
                <i className={`icon ${op.icon}`} />
                <div>{op.label}</div>
              </div>
            );

            if (op.tooltip) {
              return (
                <Tippy
                  placement={op.tooltipPlacement || "auto"}
                  content={op.tooltip}
                  key={op.key}
                >
                  {content}
                </Tippy>
              );
            }

            if (op.disableTooltip && op.disabled) {
              return (
                <Tippy
                  placement={op.tooltipPlacement || "auto"}
                  content={op.disableTooltip}
                  key={op.key}
                >
                  {content}
                </Tippy>
              );
            }

            return content;
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
