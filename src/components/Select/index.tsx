import React, { useMemo } from "react";
import classNames from "classnames";
import ReactSelect from "react-select";

import "./index.scss";

const Select = ({
  onChangeValue,
  onChange,
  value,
  options,
  isMulti,
  className,
  ...props
}) => {
  const selectValue = useMemo(() => {
    if (isMulti) {
      return options.filter((o) => value?.includes?.(o.value));
    }

    return options.find((o) => o.value === value);
  }, [value, isMulti, options]);

  const onChangeData = (val) => {
    if (onChange) {
      onChange(isMulti ? val.map((v) => v.value) : val.value);
    }

    if (onChangeValue) {
      onChangeValue(isMulti ? val.map((v) => v.value) : val.value);
    }
  };

  return (
    <ReactSelect
      classNamePrefix="select"
      className={classNames("react-select-wrapper", className)}
      menuPortalTarget={document.body}
      onChange={onChangeData}
      value={selectValue}
      options={options}
      isMulti={isMulti}
      {...props}
    />
  );
};

export default Select;
