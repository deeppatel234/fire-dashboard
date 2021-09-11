import React, { useState } from "react";
import { usePopper } from "react-popper";

import { useOnClickOutside } from "../../utils/customHooks";

import "./index.scss";

const Popover = ({
  children,
  component,
  closeOnClick,
  className,
  ...rest
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const innerPopperElementRef = useOnClickOutside(() => {
    setIsOpen(false);
  });

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    ...rest,
  });

  const onClickElement = () => {
    setIsOpen(!isOpen);
  };

  const onClickComponent = () => {
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: setReferenceElement,
        onClick: onClickElement,
      })}
      {isOpen ? (
        <div
          ref={setPopperElement}
          className={`popover-wrapper ${className || ""}`}
          style={styles.popper}
          {...attributes.popper}
        >
          <div ref={setArrowElement} style={styles.arrow} />
          <div ref={innerPopperElementRef} onClick={onClickComponent}>
            {component}
          </div>
        </div>
      ) : null}
    </>
  );
};

Popover.defaultProps = {
  placement: "bottom",
  closeOnClick: true,
};

export default Popover;
