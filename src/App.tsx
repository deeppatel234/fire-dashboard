import React, { useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Home from "pages/Home";
import Bookmark from "pages/Bookmark";

import AppContext from "src/AppContext";
import Header from "components/Header";

const bgImageUrl = "/assets/bg.jpg";

const workspaceList = [
  {
    id: 1,
    localId: 1,
    collectionKey: "my-peronsal",
    name: "My Personal",
    icon: "ri-shield-user-line",
    settings: {},
  },
  {
    id: 2,
    localId: 2,
    collectionKey: "onlinesales-ai",
    name: "Onlinesales.ai",
    icon: "ri-building-4-line",
    settings: {},
  },
];

const App = (): JSX.Element => {
  const location = useLocation();
  const [workspace, setWorkSpace] = useState(() => workspaceList[0]);

  const isHome = location.pathname === "/";
  const isBgEnabled = isHome && bgImageUrl;

  return (
    <AppContext.Provider
      value={{
        workspaceList,
        workspace,
        setWorkSpace,
      }}
    >
      {isBgEnabled ? (
        <>
          <div
            className="main-bg"
            style={{
              backgroundImage: `url("${bgImageUrl}")`,
            }}
          />
          <div className="overlay" />
        </>
      ) : null}
      <div className={`main-layout-wrapper ${isBgEnabled ? "bg" : ""}`}>
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
    </AppContext.Provider>
  );
};

export default App;
