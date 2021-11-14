import React from "react";

const BookmarkCard = ({ data: bookmark }): JSX.Element => {
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
