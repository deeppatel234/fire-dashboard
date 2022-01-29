import React, { useEffect, useState } from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ConfirmModal from "components/Confirm/ConfirmModal";
import { initWorkpaceStorage } from "services/initService";

import App from "./App";

import "react-toastify/dist/ReactToastify.css";
import "tippy.js/dist/tippy.css";

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
    <Router>
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
    </Router>
  );
};

export default Main;
