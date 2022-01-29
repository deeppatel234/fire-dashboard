import React, { useContext } from "react";
import classNames from "classnames";

import BookmarkContext from "../BookmarkContext";

const CollectionCard = ({ groupId, style }): JSX.Element => {
  const { groups } = useContext(BookmarkContext);

  const groupData = groups[groupId] || {};

  const onClickGroup = () => {
    document.getElementById(`group-${groupId}`).scrollIntoView();
  };

  return (
    <div className="group-list-item" onClick={onClickGroup} style={style}>
      <i className={classNames("group-icon", groupData.icon)} />
      <span className="group-list-title">{groupData.name}</span>
    </div>
  );
};

export default CollectionCard;
