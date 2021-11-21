import React, { useContext } from "react";

import BookmarkContext from "../BookmarkContext";

const BookmarkCard = ({ type, tabId, bookmarkId }): JSX.Element => {
  const { bookmarks, tabData } = useContext(BookmarkContext);

  const bookmark =
    type === "tab" ? tabData[tabId] : bookmarks[bookmarkId] || {};

  const onClickBookmark = () => {
    window.open(bookmark.url, "_self");
  };

  return (
    <div className="bookmark-card" onClick={onClickBookmark}>
      {bookmark.favIconUrl ? (
        <img className="fav-img" src={bookmark.favIconUrl} />
      ) : (
        <i className="ri-window-line fav-img fav-img-icon" />
      )}
      <span className="bookmark-title">{bookmark.title}</span>
    </div>
  );
};

export default BookmarkCard;
