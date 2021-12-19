import React from "react";

import useChromeSync from "utils/useChromeSync";

import "./index.scss";

/* <NavLink to="/firebase/edit">
  <i className="ri-refresh-line" />
</NavLink> */

const SyncOptions = () => {
  const { isSyncInProgress, startSync } = useChromeSync();

  return (
    <a>
      <i
        className={`sync-icon-menu ri-refresh-line ${
          isSyncInProgress ? "spin" : ""
        }`}
        onClick={startSync}
      />
    </a>
  );
};

export default SyncOptions;
