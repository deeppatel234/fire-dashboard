import React, { useEffect } from "react";
import { MemoryRouter as Router } from "react-router-dom";

import firebaseService from "./services/firebase";

import App from "./App";

import "./app.scss";

const Main = (): JSX.Element => {
  useEffect(() => {
    firebaseService.init();
  }, []);

  return (
    <Router>
      <App />
    </Router>
  );
};

export default Main;
