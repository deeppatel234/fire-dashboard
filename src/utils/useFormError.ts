import React, { useState } from "react";

const useFormError = () => {
  const [showError, setShowError] = useState(false);

  const onSubmitForm = (func) => {
    return (...props) => {
      setShowError(true);
      func(...props);
    };
  };

  return { onSubmitForm, showError };
};

export default useFormError;
