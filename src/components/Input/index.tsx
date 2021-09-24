import React from "react";
import classNames from "classnames";

import "./index.scss";

const Input = ({ className, onChange, onChangeValue, ...props }) => {
  const onChangeInput = (event) => {
    if (onChange) {
      onChange(event);
    }
    if (onChangeValue) {
      onChangeValue(event.target.value);
    }
  };

  return (
    <input
      className={classNames("input-component", className)}
      onChange={onChangeInput}
      {...props}
    />
  );
};

export default Input;
