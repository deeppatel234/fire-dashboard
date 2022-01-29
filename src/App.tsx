import React, { useEffect, useMemo, useState } from "react";
import { Switch, Route, useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import Home from "pages/Home";
import Bookmark from "pages/Bookmark";
import Onboarding from "pages/Onboarding";
import FirebaseSetup from "pages/FirebaseSetup";

import AppContext from "src/AppContext";
import Header from "components/Header";
import { routes } from "src/constants/routes";
import { initStorage, deleteWorkspaceDb } from "services/initService";
import WorkspaceModal from "services/WorkspaceModal";

const App = (): JSX.Element => {
  const location = useLocation();
  const history = useHistory();
  const [workspaceList, setWorkspaceList] = useState([]);
  const [workspaceId, setWorkSpaceId] = useState(() => {
    return localStorage.getItem("workspaceId");
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newWorkspaceIcon, setNewWorkspaceIcon] = useState("ri-user-line");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const workspace = useMemo(() => {
    return workspaceList.find((w) => w.id === workspaceId) || {};
  }, [workspaceId, workspaceList]);

  const loadWorkspaceDb = async (newWorkspace) => {
    try {
      initStorage(newWorkspace);
      setWorkSpaceId(newWorkspace.id);
      setIsLoading(false);
      history.push(routes[newWorkspace.settings.general.defaultApp].path);
    } catch (err) {
      toast.error("Something went wrong. please try again");
    }
  };

  const loadData = async () => {
    try {
      const workspaceData = await WorkspaceModal.getAll();
      if (workspaceData[0]) {
        setWorkspaceList(workspaceData);
        loadWorkspaceDb(
          workspaceData.find((w) => w.id === workspaceId) || workspaceData[0],
        );
      } else {
        history.replace(routes.ONBOARDING.path);
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Something went wrong. please try again");
    }
  };

  const loadColor = () => {
    document.body.classList.forEach((name) => {
      if (name.includes("color-")) {
        document.body.classList.remove(name);
      }
    });

    document.body.classList.add(
      workspace?.settings?.general?.color || "color-1",
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadColor();
  }, [workspace]);

  const onChangeWorkspace = (newWorkspace) => {
    loadWorkspaceDb(newWorkspace);
    localStorage.setItem("workspaceId", newWorkspace.id);
  };

  const updateWorkspace = async (updatedData) => {
    let response = null;

    if (updatedData.id) {
      response = await WorkspaceModal.update(updatedData);
    } else {
      response = await WorkspaceModal.add(updatedData);
    }

    if (workspaceList.find((w) => w.id === response.id)) {
      setWorkspaceList(
        workspaceList.map((w) => {
          if (w.id === response.id) {
            return response;
          }

          return w;
        }),
      );
    } else {
      setWorkspaceList([...workspaceList, response]);
    }

    return response;
  };

  const removeWorkspace = async (workspaceToRemove) => {
    await WorkspaceModal.update({
      ...workspaceToRemove,
      isDeleted: 1,
    });

    deleteWorkspaceDb(workspaceToRemove);

    const newList = workspaceList.filter((w) => w.id !== workspaceToRemove.id);

    if (workspaceToRemove.id === workspace.id) {
      onChangeWorkspace(newList[0]);
    }

    setWorkspaceList(newList);
  };

  const createAndLoadFirstWorkspace = async () => {
    const response = await updateWorkspace({
      ...WorkspaceModal.getInitialValues(),
      name: newWorkspaceName || "Your Workspace",
      icon: newWorkspaceIcon,
    });
    onChangeWorkspace(response);
  };

  const renderHeader = () => {
    if (
      location.pathname.startsWith("/firebase") ||
      location.pathname === "/onboarding"
    ) {
      return null;
    }

    return <Header />;
  };

  if (isLoading) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        workspaceList,
        workspace,
        loadWorkspaces: loadData,
        setWorkSpace: onChangeWorkspace,
        removeWorkspace,
        updateWorkspace,
        createAndLoadFirstWorkspace,
        newWorkspaceIcon,
        setNewWorkspaceIcon,
        newWorkspaceName,
        setNewWorkspaceName,
      }}
    >
      <div id="main-bg" />
      <div className="overlay" />
      <div id="main-layout-wrapper" className="main-layout-wrapper">
        {renderHeader()}
        <div className="main-body">
          <Switch>
            <Route exact path={routes.BOOKMARK.path}>
              <Bookmark />
            </Route>
            <Route exact path={routes.ONBOARDING.path}>
              <Onboarding />
            </Route>
            <Route path={routes.FIREBASE.path}>
              <FirebaseSetup />
            </Route>
            <Route exact path={routes.HOME.path}>
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
