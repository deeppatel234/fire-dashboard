import React from "react";
import classNames from "classnames";

import "./index.scss";

const Loading = ({ className }) => {
  return (
    <div className={classNames("loader", className)}>
      <i className="ri-loader-4-line" />
    </div>
  );
};

export default Loading;
