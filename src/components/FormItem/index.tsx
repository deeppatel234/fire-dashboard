import React, { useCallback, useContext, useMemo } from "react";
import classNames from "classnames";
import _get from "lodash/get";

import FormGroupContext from "../FormGroup/FormGroupContext";

import "./index.scss";

const valueKeyMap = {
  switch: "checked",
};

const FormItem = ({
  children,
  className,
  label,
  labelWidth: pLabelWidth,
  formKey,
  errorMsg: pErrorMsg,
  componentType,
}) => {
  const {
    labelWidth: contextLabelWidth,
    values,
    setValue,
  } = useContext(FormGroupContext);

  const value = useMemo(() => {
    return _get(values, formKey);
  }, [values, formKey]);

  const onChangeValue = useCallback(
    (newValue) => {
      setValue(formKey, newValue);
    },
    [setValue, formKey],
  );

  return (
    <div className={classNames(className, "form-item")}>
      {label ? (
        <div className={`label col-sm-${pLabelWidth || contextLabelWidth}`}>
          {label}
        </div>
      ) : null}
      <div
        className={classNames(
          {
            component: true,
            [`col-sm-${12 - (pLabelWidth || contextLabelWidth)}`]: !!label,
          },
          componentType,
        )}
      >
        <div>
          {typeof children === "function"
            ? children({
                [valueKeyMap[componentType] || "value"]: value,
                onChangeValue,
              })
            : React.cloneElement(children, {
                [valueKeyMap[componentType] || "value"]: value,
                onChangeValue,
              })}
        </div>
        <div className="error-msg">{pErrorMsg}</div>
      </div>
    </div>
  );
};

export default FormItem;
