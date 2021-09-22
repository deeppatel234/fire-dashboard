import React from "react";
import { useHistory } from "react-router";

import WorkspaceModal from "components/WorkspaceModal";

import AddWorkspaceSvg from "./AddWorkspaceSvg";

import "./index.scss";

const Onboarding = () => {
  const history = useHistory();

  const onSuccessWorkspaceForm = () => {
    history.push("/");
  };

  return (
    <div className="onboarding-wrapper">
      <div className="svg-image col-md-6">
        <AddWorkspaceSvg />
      </div>
      <div className="form-content col-md-6">
        <div className="onboarding-title">Create your first workspace</div>
        <div className="workspace-modal">
          <WorkspaceModal
            showClose={false}
            showHeader={false}
            onSuccess={onSuccessWorkspaceForm}
          />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
