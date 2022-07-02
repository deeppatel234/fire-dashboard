import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "components/Button";
import Input from "components/Input";
import IconSelector from "components/IconSelector";
import AppContext from "src/AppContext";

import "./index.scss";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const {
    newWorkspaceIcon,
    setNewWorkspaceIcon,
    newWorkspaceName,
    setNewWorkspaceName,
    createAndLoadFirstWorkspace,
  } = useContext(AppContext);

  const createAndLoadDashboard = async () => {
    try {
      await createAndLoadFirstWorkspace();
      navigate("/");
    } catch (err) {
      toast.error("Unable to create your first workspace. please try again");
    }
  };

  const onClickSyncNow = () => {
    navigate("/firebase/create");
  };

  const nextStep = () => {
    if (step === 1 && !newWorkspaceName) {
      toast.error("Please enter workspace name");
    } else {
      setStep(step + 1);
    }
  };

  const renderStep1 = () => {
    return (
      <div className="welcome-block">
        <img alt="logo" className="logo" src="/assets/icons/icon500.png" />
        <div className="title">Welcome to Fire Dashboard</div>
        <div className="sub-title">
          Your personal browser new tab dashboard with multiple workspaces
        </div>
        <Button size="large" onClick={nextStep}>
          Next
        </Button>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="welcome-block">
        <div className="title">Create your first workspace</div>
        <div className="workspace-basic">
          <IconSelector selectedIcon={newWorkspaceIcon} setSelectedIcon={setNewWorkspaceIcon} />
          <Input
            placeholder="Workspace Name"
            value={newWorkspaceName}
            onChangeValue={setNewWorkspaceName}
          />
        </div>
        <Button size="large" onClick={nextStep}>
          Next
        </Button>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="welcome-block sync">
        <i className="sync-icon ri-refresh-fill" />
        <div className="title">Sync your data with firebase</div>
        <div className="sub-title">
          Add your firebase credentials to load current data or sync new data
        </div>
        <Button size="large" onClick={onClickSyncNow}>
          Do it now
        </Button>
        <Button className="btn-ml" size="large" onClick={createAndLoadDashboard}>
          Do it later
        </Button>
      </div>
    );
  };

  const stepRenderer = [renderStep1, renderStep2, renderStep3];

  return <div className="onboarding-wrapper">{stepRenderer[step]()}</div>;
};

export default Onboarding;
