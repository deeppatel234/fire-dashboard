import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";

import { useOnClickOutside } from "../../utils/customHooks";

import "./index.scss";

const Popover = ({
  children,
  component,
  closeOnClick,
  className,
  isOpen: pIsOpen,
  setIsOpen: pSetIsOpen,
  placement,
  ...rest
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const setOpenToUse = pSetIsOpen || setIsOpen;

  useEffect(() => {
    if (pIsOpen !== undefined) {
      setIsOpen(pIsOpen);
    }
  }, [pIsOpen]);

  const innerPopperElementRef = useOnClickOutside(() => {
    setOpenToUse(false);
  });

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    placement,
    ...rest,
  });

  const onClickElement = () => {
    setOpenToUse(!isOpen);
  };

  const onClickComponent = () => {
    if (closeOnClick) {
      setOpenToUse(false);
    }
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: setReferenceElement,
        onClick: onClickElement,
      })}
      {isOpen
        ? ReactDOM.createPortal(
            <div
              ref={setPopperElement}
              className={`popover-wrapper ${className || ""}`}
              style={styles.popper}
              {...attributes.popper}
            >
              <div
                ref={setArrowElement}
                style={styles.arrow}
                className={`arrow ${placement}`}
              />
              <div ref={innerPopperElementRef} onClick={onClickComponent}>
                {component}
              </div>
            </div>,
            document.getElementById("popoverRoot"),
          )
        : null}
    </>
  );
};

Popover.defaultProps = {
  placement: "bottom",
  closeOnClick: false,
};

export default Popover;
