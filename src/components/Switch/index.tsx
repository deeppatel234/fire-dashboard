import React from "react";
import classNames from "classnames";

import { useControlled } from "utils/customHooks";

import "./index.scss";

const Switch = ({
  defaultChecked,
  checked: pIsChecked,
  disabled,
  onChange,
  onChangeValue,
}) => {
  const [checked, setIsChecked, isControlled] = useControlled(pIsChecked, defaultChecked);

  const onToggle = (event) => {
    if (onChange) {
      onChange(event, !checked);
    }
    if (onChangeValue) {
      onChangeValue(!checked);
    }
    if (!isControlled) {
      setIsChecked(!checked);
    }
  };

  return (
    <span
      role="switch"
      className={classNames("rs-btn-toggle", {
        checked,
        disabled,
      })}
      onClick={onToggle}
    >
      <span className="rs-btn-toggle-inner" />
    </span>
  );
};

export default Switch;
