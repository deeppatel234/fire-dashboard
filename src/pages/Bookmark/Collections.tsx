import React, { useState } from "react";
import _keyBy from "lodash/keyBy";

import Button from "components/Button";

import BookmarkGroupModal from "../../services/BookmarkGroupModal";

const Collections = (): JSX.Element => {
  const [groups, setGroups] = useState({});

  const onClickGroup = (id) => {
    document.getElementById(`group-${id}`).scrollIntoView();
  };

  const onClickCreateGroup = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.add({
        name: `Untitled`,
        icon: "ri-folder-line",
      });
      setGroups({ ..._keyBy([groupResponse], "id"), ...groups });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="group-wrapper">
      <div className="group-header">
        <div className="group-header-title">Collections</div>
        <Button outline size="small" onClick={onClickCreateGroup}>
          Create
        </Button>
      </div>
      <div className="group-list">
        {Object.keys(groups).map((id) => {
          const group = groups[id];

          return (
            <div
              key={id}
              className="group-list-item"
              onClick={() => onClickGroup(id)}
            >
              <i className={`group-icon ${group.icon}`} />
              <span className="group-list-title">{group.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collections;
