import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import RadioContext from "./RadioContext";
import { useControlled } from "utils/customHooks";

import "./index.scss";

const RadioGroup = ({
  className,
  inline,
  children,
  defaultValue,
  value: pValue,
  name,
  disabled,
  onChange,
  onChangeValue,
}) => {
  const [value, setValue] = useControlled(pValue, defaultValue);

  const handleChange = useCallback(
    (nextValue, event) => {
      setValue(nextValue);
      if (onChange) {
        onChange(event);
      }

      if (onChangeValue) {
        onChangeValue(nextValue);
      }
    },
    [onChange, onChangeValue, setValue],
  );

  const contextValue = useMemo(
    () => ({
      name,
      value: typeof value === "undefined" ? null : value,
      disabled,
      onChange: handleChange,
    }),
    [disabled, handleChange, name, value],
  );

  return (
    <RadioContext.Provider value={contextValue}>
      <div className={classNames(className, "radio-group-wrapper", { inline })}>
        {children}
      </div>
    </RadioContext.Provider>
  );
};

export default RadioGroup;
