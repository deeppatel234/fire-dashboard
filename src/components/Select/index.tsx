import React from "react";

import ReactSelect from "react-select";

import "./index.scss";

const Select = (props) => {
  return (
    <ReactSelect
      classNamePrefix="select"
      className="react-select-wrapper"
      menuPortalTarget={document.body}
      {...props}
    />
  );
};

export default Select;
