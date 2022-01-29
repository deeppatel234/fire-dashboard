import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

import AppContext from "src/AppContext";

import Modal from "components/Modal";
import Popover from "components/Popover";
import WorkspaceModal from "components/WorkspaceModal";
import SyncOptions from "components/SyncOptions";

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
  const [isOpenWorkspacePopper, setIsOpenWorkspacePopper] = useState(false);

  const toggleWorkspaceModal = () => {
    setShowWorkspaceModal({
      ...showWorkspaceModal,
      open: !showWorkspaceModal.open,
    });
  };

  const toggleCreateWorkspaceModal = () => {
    setShowWorkspaceModal({
      open: !showWorkspaceModal.open,
      dataToEdit: null,
    });
  };

  const onClickSettings = (event, dataToEdit) => {
    event.stopPropagation();
    setIsOpenWorkspacePopper(false);
    setShowWorkspaceModal({
      open: true,
      dataToEdit,
    });
  };

  const getWorkspacePopover = (): JSX.Element => {
    return (
      <div className="workspace-popover">
        {workspaceList.map((d) => {
          return (
            <div
              key={d.id}
              className={classNames("list-item", {
                active: workspace.id === d.id,
              })}
              onClick={() => setWorkSpace(d)}
            >
              <div className="content">
                <i className={classNames("workspace-icon", d.icon)} />
                {d.name}
              </div>
              <div
                className="settings"
                onClick={(event) => onClickSettings(event, d)}
              >
                <i className="ri-settings-3-line" />
              </div>
            </div>
          );
        })}
        <div className="list-item add" onClick={toggleCreateWorkspaceModal}>
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
        isOpen={isOpenWorkspacePopper}
        setIsOpen={setIsOpenWorkspacePopper}
        closeOnClick
      >
        <div className="workspace-block">
          <i className={classNames("icon workspace", workspace?.icon)} />
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
        <div className="setting-block">
          <a onClick={(event) => onClickSettings(event, workspace)}>
            <i className="ri-settings-3-line" />
          </a>
          <SyncOptions />
        </div>
      </div>
    </div>
  );
};

export default Header;
