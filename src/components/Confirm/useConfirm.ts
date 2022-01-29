import React, { useContext } from "react";

import ConfirmContext from "./ConfirmContext";

const useConfirm = () => {
  const { openDialog } = useContext(ConfirmContext);

  const confirm = ({ ...options }) => {
    return new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });
  };

  return { confirm };
};

export default useConfirm;
