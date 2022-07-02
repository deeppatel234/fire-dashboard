import React, { useEffect, useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ConfirmModal from "components/Confirm/ConfirmModal";
import { initWorkpaceStorage } from "services/initService";

import "react-toastify/dist/ReactToastify.css";
// eslint-disable-next-line import/no-extraneous-dependencies
import "tippy.js/dist/tippy.css";

import App from "./App";

import "./styles/remixicon.css";
import "./styles/app.scss";

const Main = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      await initWorkpaceStorage();
      setIsLoading(false);
    } catch (err) {}
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <MemoryRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ConfirmModal>
        <App />
      </ConfirmModal>
    </MemoryRouter>
  );
};

export default Main;
