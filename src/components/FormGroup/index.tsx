import React, { useMemo } from "react";
import classNames from "classnames";

import FormGroupContext from "./FormGroupContext";

import "./index.scss";

const FormGroup = ({
  children,
  className,
  values,
  labelWidth,
  setValue,
  errors,
  showError,
}) => {
  const contextValues = useMemo(() => {
    return {
      values,
      labelWidth,
      setValue,
      errors,
      showError,
    };
  }, [values, labelWidth, setValue, errors, showError]);

  return (
    <FormGroupContext.Provider value={contextValues}>
      <div className={classNames(className, "form-group-wrapper")}>
        {children}
      </div>
    </FormGroupContext.Provider>
  );
};

FormGroup.defaultProps = {
  labelWidth: 4,
};

export default FormGroup;
