import React, { useContext } from "react";

import BookmarkContext from "../BookmarkContext";

const TabCard = ({ tabId }): JSX.Element => {
  const { tabData } = useContext(BookmarkContext);

  const data = tabData[tabId] || {};

  return (
    <div className="active-list-item">
      {data.favIconUrl ? (
        <img className="fav-img" src={data.favIconUrl} />
      ) : (
        <i className="ri-window-line fav-img fav-img-icon" />
      )}
      <span className="tab-title">{data.title}</span>
    </div>
  );
};

export default TabCard;
