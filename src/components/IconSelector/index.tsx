import React, { useState } from "react";
import classNames from "classnames";

import Popover from "components/Popover";

import { iconWithGroup } from "./icons";

import "./index.scss";

const IconSelector = ({ selectedIcon, setSelectedIcon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickGroupSideBar = (key) => {
    document.getElementById(`icon-group-${key}`).scrollIntoView();
  };

  const onSelectIcon = (className) => {
    setSelectedIcon(className);
    setIsOpen(false);
  };

  const renderComponent = () => {
    return (
      <div className="icon-selector-popover-content">
        <div className="group-sidebar">
          {Object.keys(iconWithGroup).map((key) => {
            return (
              <div
                key={key}
                className="title"
                onClick={() => onClickGroupSideBar(key)}
              >
                {key}
              </div>
            );
          })}
        </div>
        <div className="group-content-wrapper">
          {Object.keys(iconWithGroup).map((key) => {
            return (
              <div key={key} className="group-content" id={`icon-group-${key}`}>
                <div className="group-title">{key}</div>
                <div className="group-icons">
                  {Object.keys(iconWithGroup[key]).map((iconKey) => {
                    return iconWithGroup[key][iconKey].icon.map((type) => {
                      const className = `ri-${iconKey}${
                        type ? `-${type}` : ""
                      }`;
                      return (
                        <div
                          key={type}
                          className="group-icon-block"
                          onClick={() => onSelectIcon(className)}
                        >
                          <i className={classNames("icon", className)} />
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Popover
      className="icon-selector-popover"
      component={renderComponent()}
      placement="bottom-start"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="icon-selector-block">
        <i className={classNames("icon", selectedIcon)} />
      </div>
    </Popover>
  );
};

export default IconSelector;
