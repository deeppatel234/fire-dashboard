import React, { useEffect, useMemo, useState } from "react";
import { Switch, Route, useLocation, useHistory } from "react-router-dom";

import Home from "pages/Home";
import Bookmark from "pages/Bookmark";
import Onboarding from "pages/Onboarding";
import FirebaseSetup from "pages/FirebaseSetup";

import AppContext from "src/AppContext";
import Header from "components/Header";
import Loading from "components/Loading";

import { initStorage } from "./services/initService";
import WorkspaceModal from "./services/WorkspaceModal";

const DEFAULT_IMAGE = "/assets/bg.jpg";

const App = (): JSX.Element => {
  const location = useLocation();
  const history = useHistory();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [workspaceId, setWorkSpaceId] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [bgImageUrl, setBgImageUrl] = useState();
  const [isBgLoading, setIsBgLoading] = useState(false);

  const workspace = useMemo(() => {
    return workspaceList.find((w) => w.id === workspaceId) || {};
  }, [workspaceId, workspaceList]);

  const loadImage = async () => {
    try {
      setIsBgLoading(true);
      const res = await fetch(
        `https://source.unsplash.com/random/${window.outerWidth}x${window.innerHeight}?nature,water`,
      );
      if (res.url) {
        await fetch(res.url);
        setBgImageUrl(res.url);
      } else {
        setBgImageUrl(DEFAULT_IMAGE);
      }
    } catch (err) {
      setBgImageUrl(DEFAULT_IMAGE);
    }
    setIsBgLoading(false);
  };

  const loadWorkspaceDb = async (newWorkspace) => {
    try {
      initStorage(newWorkspace);
      setWorkSpaceId(newWorkspace.id);
      loadImage();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const loadData = async () => {
    try {
      const workspaceData = await WorkspaceModal.getAll();
      if (workspaceData[0]) {
        setWorkspaceList(workspaceData);
        loadWorkspaceDb(workspaceData[0]);
      } else {
        history.push("/onboarding");
        setIsLoading(false);
      }
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
  const isFirebase = location.pathname.startsWith("/firebase");
  const isOnboarding = location.pathname === "/onboarding";
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
        {!isOnboarding && !isFirebase ? <Header /> : null}
        <div className="main-body">
          {isBgLoading ? <Loading className="image-loader-main" /> : null}
          <Switch>
            <Route exact path="/bookmark">
              <Bookmark />
            </Route>
            <Route exact path="/onboarding">
              <Onboarding />
            </Route>
            <Route path="/firebase/:mode">
              <FirebaseSetup />
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
