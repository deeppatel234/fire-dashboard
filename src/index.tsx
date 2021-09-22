import React, { useEffect, useState } from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import firebaseService from "./services/firebase";
import { initWorkpaceStorage } from "./services/initService";

import App from "./App";

import "react-toastify/dist/ReactToastify.css";

import "./styles/remixicon.css";
import "./styles/app.scss";

const Main = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      firebaseService.init();
      await initWorkpaceStorage();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) {
    return <div>loading</div>;
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
      <App />
    </Router>
  );
};

export default Main;
