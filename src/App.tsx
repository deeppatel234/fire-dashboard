import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Bookmark from "./pages/Bookmark";

import Header from "./components/Header";

import "./app.scss";

const bgImageUrl = "/assets/bg.jpg";

const App = (): JSX.Element => {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isBgEnabled = isHome && bgImageUrl;

  return (
    <div
      className={`main-layout-wrapper ${isBgEnabled ? "bg" : ""}`}
      style={{ backgroundImage: isBgEnabled ? `url("${bgImageUrl}")` : "none" }}
    >
      {isBgEnabled ? <div className="overlay" /> : null}
      <Header />
      <div className="main-body">
        <Switch>
          <Route exact path="/bookmark">
            <Bookmark />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;
