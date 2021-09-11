import React from "react";
import classNames from "classnames";

import "./index.scss";

const Button = React.forwardRef(
  (
    {
      type,
      btnType,
      children,
      outline,
      rounded,
      className,
      disabled,
      block,
      size,
      isLoading,
      link,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        type={btnType}
        {...props}
        ref={ref}
        className={classNames(
          `btn`,
          {
            [`btn-${type}`]: true,
            outline,
            rounded,
            disabled,
            block,
            link,
            [`btn-${size}`]: true,
          },
          className,
        )}
      >
        {isLoading ? <i className="loading-icon ri-loader-4-line" /> : null}
        {children}
      </button>
    );
  },
);

Button.defaultProps = {
  type: "primary", // default, danger, primary, success
  btnType: "button",
  outline: false,
  rounded: false,
  disabled: false,
  block: false,
  isLoading: false,
  link: false,
  size: "default",
};

export default Button;
