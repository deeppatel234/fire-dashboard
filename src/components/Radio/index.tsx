import React, { useCallback, useContext } from "react";
import classNames from "classnames";

import RadioContext from "../RadioGroup/RadioContext";

import "./index.scss";

const Radio = ({
  checked: pChecked,
  onChange,
  onChangeValue,
  disabled,
  label,
  name,
  value,
}) => {
  const {
    value: groupValue,
    name: nameContext,
    disabled: disabledContext,
    onChange: onGroupChange,
  } = useContext(RadioContext);

  const checked =
    typeof groupValue !== "undefined" ? groupValue === value : pChecked;

  const onChangeRadio = useCallback(
    (event) => {
      if (disabled || disabledContext) {
        return;
      }

      if (onGroupChange) {
        onGroupChange(value, event);
      }
      if (onChange) {
        onChange(event);
      }
      if (onChangeValue) {
        onChangeValue(event.target.checked);
      }
    },
    [disabled, disabledContext, onChange, onGroupChange, onChangeValue, value],
  );

  return (
    <div
      className={classNames({
        radio: true,
        checked,
        disabled: disabled || disabledContext,
      })}
    >
      <div className="radio-checker">
        <label htmlFor={`${name || nameContext}-${value}`}>
          <span className="radio-wrapper">
            <input
              type="radio"
              name={name || nameContext}
              id={`${name || nameContext}-${value}`}
              value={value}
              disabled={disabled || disabledContext}
              onChange={onChangeRadio}
              checked={checked}
            />
            <span className="radio-inner" />
          </span>
          {label}
        </label>
      </div>
    </div>
  );
};

export default Radio;
