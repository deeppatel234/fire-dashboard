import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import AppContext from "src/AppContext";

import Modal from "components/Modal";
import Popover from "components/Popover";
import WorkspaceModal from "components/WorkspaceModal";

import "./index.scss";

interface Routes {
  title: string;
  path: string;
  exact?: boolean;
}

const routes: Routes[] = [
  {
    title: "Home",
    path: "/",
    exact: true,
  },
  {
    title: "Bookmark",
    path: "/bookmark",
  },
];

const Header = (): JSX.Element => {
  const { workspace, setWorkSpace, workspaceList } = useContext(AppContext);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(true);

  const toggleWorkspaceModal = () => {
    setShowWorkspaceModal(!showWorkspaceModal);
  };

  const getWorkspacePopover = (): JSX.Element => {
    return (
      <div className="workspace-popover">
        {workspaceList.map((d) => {
          return (
            <div
              key={d.localId}
              className={`list-item ${
                workspace.localId === d.localId ? "active" : ""
              }`}
              onClick={() => setWorkSpace(d)}
            >
              <i className={`icon ${d.icon}`} />
              {d.name}
            </div>
          );
        })}
        <div className="list-item" onClick={toggleWorkspaceModal}>
          <i className="icon ri-add-line" /> Add New Workspace
        </div>
      </div>
    );
  };

  return (
    <div className="main-header">
      <Popover
        className="header-wrorkspace-popover"
        component={getWorkspacePopover()}
      >
        <div className="workspace-block">
          <i className={`icon workspace ${workspace.icon}`} />
          {workspace.name}
          <i className="arrow ri-arrow-down-s-line" />
        </div>
      </Popover>
      <Modal open={showWorkspaceModal} onClose={toggleWorkspaceModal}>
        <WorkspaceModal />
      </Modal>
      <div className="nav-block">
        {routes.map(({ title, path, ...rest }) => {
          return (
            <NavLink key={path} to={path} {...rest}>
              {title}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
