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
  const [showWorkspaceModal, setShowWorkspaceModal] = useState({
    open: false,
    dataToEdit: null,
  });

  const toggleWorkspaceModal = () => {
    setShowWorkspaceModal({
      open: !showWorkspaceModal.open,
      dataToEdit: null,
    });
  };

  const onClickSettings = (dataToEdit) => {
    setShowWorkspaceModal({
      open: true,
      dataToEdit,
    });
  };

  console.log(workspaceList);

  const getWorkspacePopover = (): JSX.Element => {
    return (
      <div className="workspace-popover">
        {workspaceList.map((d) => {
          return (
            <div
              key={d.id}
              className={`list-item ${workspace.id === d.id ? "active" : ""}`}
              onClick={() => setWorkSpace(d)}
            >
              <div className="content">
                <i className={`workspace-icon ${d.icon}`} />
                {d.name}
              </div>
              <div className="settings" onClick={() => onClickSettings(d)}>
                <i className="ri-settings-3-line" />
              </div>
            </div>
          );
        })}
        <div className="list-item add" onClick={toggleWorkspaceModal}>
          <div className="content">
            <i className="workspace-icon ri-add-line" /> Add New Workspace
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-header">
      <Popover
        className="header-wrorkspace-popover"
        component={getWorkspacePopover()}
        closeOnClick
      >
        <div className="workspace-block">
          <i className={`icon workspace ${workspace?.icon}`} />
          {workspace?.name}
          <i className="arrow ri-arrow-down-s-line" />
        </div>
      </Popover>
      <Modal open={showWorkspaceModal.open} onClose={toggleWorkspaceModal}>
        <WorkspaceModal
          dataToEdit={showWorkspaceModal.dataToEdit}
          onClose={toggleWorkspaceModal}
        />
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
