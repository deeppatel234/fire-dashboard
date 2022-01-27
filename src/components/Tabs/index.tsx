import React from "react";
import classNames from "classnames";

import "./index.scss";

const Tabs = ({ list, value, onChange }) => {
  return (
    <div className="tab-list-wrapper">
      {list.map((l) => {
        return (
          <div
            key={l.value}
            className={classNames("list-item", { active: value === l.value })}
            onClick={() => onChange(l.value)}
          >
            {l.icon ? <i className={classNames("icon", l.icon)} /> : null}
            {l.label}
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
