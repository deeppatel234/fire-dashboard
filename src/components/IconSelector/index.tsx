import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import Popover from "components/Popover";
import Input from "components/Input";

import { iconWithGroup } from "./icons";

import "./index.scss";

const IconSelector = ({ selectedIcon, setSelectedIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const iconWithGroupData = useMemo(() => {
    if (search) {
      return Object.keys(iconWithGroup).reduce((memo, key) => {
        const groupKeys = Object.keys(iconWithGroup[key]).filter((groupKey) =>
          groupKey.toLowerCase().includes(search.toLowerCase()),
        );

        groupKeys.forEach((groupKey) => {
          if (!memo[key]) {
            memo[key] = {};
          }

          memo[key][groupKey] = iconWithGroup[key][groupKey];
        });

        return memo;
      }, {});
    }

    return iconWithGroup;
  }, [search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

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
        <div className="icon-input">
          <Input
            placeholder="Search icon"
            value={search}
            onChangeValue={setSearch}
          />
        </div>
        {Object.keys(iconWithGroupData).length ? (
          <div className="icon-block">
            <div className="group-sidebar">
              {Object.keys(iconWithGroupData).map((key) => {
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
              {Object.keys(iconWithGroupData).map((key) => {
                return (
                  <div
                    key={key}
                    className="group-content"
                    id={`icon-group-${key}`}
                  >
                    <div className="group-title">{key}</div>
                    <div className="group-icons">
                      {Object.keys(iconWithGroupData[key]).map((iconKey) => {
                        return iconWithGroupData[key][iconKey].icon.map(
                          (type) => {
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
                          },
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="icon-block empty-block">
            <div>No icon found</div>
          </div>
        )}
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
