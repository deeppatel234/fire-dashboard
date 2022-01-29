import React from "react";
import { Modal } from "react-responsive-modal";
import classNames from "classnames";

import "react-responsive-modal/styles.css";

import "./index.scss";

const ModalComponent = ({ ...props }) => {
  return (
    <Modal
      center
      {...props}
      closeIcon={<i className="close-btn ri-close-line"></i>}
    />
  );
};

ModalComponent.Header = ({ className, children }) => {
  return (
    <div className={classNames("modal-header", className)}>{children}</div>
  );
};

ModalComponent.Body = ({ className, children }) => {
  return <div className={classNames("modal-body", className)}>{children}</div>;
};

ModalComponent.Footer = ({ className, children }) => {
  return (
    <div className={classNames("modal-footer", className)}>{children}</div>
  );
};

export default ModalComponent;
