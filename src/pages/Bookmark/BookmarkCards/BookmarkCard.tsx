import React, { useContext } from "react";

import BookmarkContext from "../BookmarkContext";

const BookmarkCard = ({ bookmarkId }): JSX.Element => {
  const { bookmarks } = useContext(BookmarkContext);

  const bookmark = bookmarks[bookmarkId] || {};

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
