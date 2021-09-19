import React, { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Home from "pages/Home";
import Bookmark from "pages/Bookmark";

import AppContext from "src/AppContext";
import Header from "components/Header";

import WorkspaceModal from "./services/WorkspaceModal";

const bgImageUrl = "/assets/bg.jpg";

const App = (): JSX.Element => {
  const location = useLocation();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [workspace, setWorkSpace] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const workspaceData = await WorkspaceModal.getAll();
      setWorkspaceList(workspaceData);
      setWorkSpace(workspaceData[0]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <div>Loading</div>;
  }

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
