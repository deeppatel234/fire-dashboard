import React, { useRef } from "react";
import classNames from "classnames";

import "./index.scss";

const Textarea = ({
  className,
  onChange,
  onChangeValue,
  autoResize,
  ...props
}) => {
  const inputEl = useRef(null);

  const onChangeTextarea = (event) => {
    if (onChange) {
      onChange(event);
    }
    if (onChangeValue) {
      onChangeValue(event.target.value);
    }
    if (autoResize) {
      inputEl.current.style.height = "auto";
      inputEl.current.style.height = `${inputEl.current.scrollHeight}px`;
    }
  };

  return (
    <textarea
      ref={inputEl}
      className={classNames("input-component", "textarea-component", className)}
      onChange={onChangeTextarea}
      {...props}
    />
  );
};

Textarea.defaultProps = {
  autoResize: true,
};

export default Textarea;
