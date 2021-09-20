import React, { useEffect, useMemo, useState } from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Home from "pages/Home";
import Bookmark from "pages/Bookmark";

import AppContext from "src/AppContext";
import Header from "components/Header";

import { initStorage } from "./services/initService";
import WorkspaceModal from "./services/WorkspaceModal";

const bgImageUrl = "/assets/bg.jpg";

const App = (): JSX.Element => {
  const location = useLocation();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [workspaceId, setWorkSpaceId] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const workspace = useMemo(() => {
    return workspaceList.find((w) => w.id === workspaceId) || {};
  }, [workspaceId, workspaceList]);

  const loadWorkspaceDb = async (newWorkspace) => {
    try {
      initStorage(newWorkspace);
      setWorkSpaceId(newWorkspace.id);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const loadData = async () => {
    try {
      const workspaceData = await WorkspaceModal.getAll();
      setWorkspaceList(workspaceData);
      loadWorkspaceDb(workspaceData[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onChangeWorkspace = (newWorkspace) => {
    loadWorkspaceDb(newWorkspace);
  };

  const updateWorkspace = (updatedData) => {
    if (workspaceList.find((w) => w.id === updatedData.id)) {
      setWorkspaceList(
        workspaceList.map((w) => {
          if (w.id === updatedData.id) {
            return updatedData;
          }

          return w;
        }),
      );

      return;
    }

    setWorkspaceList([...workspaceList, updatedData]);
  };

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
        setWorkSpace: onChangeWorkspace,
        updateWorkspace,
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
