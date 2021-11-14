import React from "react";

const CollectionCard = ({ id, data, style }): JSX.Element => {
  const onClickGroup = () => {
    document.getElementById(`group-${id}`).scrollIntoView();
  };

  return (
    <div className="group-list-item" onClick={onClickGroup} style={style}>
      <i className={`group-icon ${data.icon}`} />
      <span className="group-list-title">{data.name}</span>
    </div>
  );
};

export default CollectionCard;
