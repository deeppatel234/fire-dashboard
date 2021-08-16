import React, { useEffect } from "react";
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";

import firebaseService from "./services/firebase";

import Home from "./pages/Home";
import Bookmark from "./pages/Bookmark";

import Header from "./components/Header";

import "./app.scss";

const App = (): JSX.Element => {
  useEffect(() => {
    firebaseService.init();
  }, []);

  return (
    <Router>
      <div className="main-layout-wrapper">
        <Header />
        <div className="main-body">
          <Switch>
            <Route path="/bookmark">
              <Bookmark />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
