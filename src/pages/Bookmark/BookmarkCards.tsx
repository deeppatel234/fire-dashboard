import React, { useContext } from "react";

import BookmarkContext from "./BookmarkContext";

const BookmarkCards = (): JSX.Element => {
  const { groups, groupedBookmark } = useContext(BookmarkContext);

  const onClickCard = (bookmark) => {
    window.open(bookmark.url, "_self");
  };

  return (
    <div className="card-wrapper">
      {Object.keys(groups).map((id) => {
        const bookmarks = groupedBookmark[id] || [];
        const groupData = groups[id] || {};

        return (
          <div key={id} id={`group-${id}`} className="group-card-wrapper">
            <div className="group-card-title">
              {groupData.name}
              <span className="group-name-edit">
                <i className="ri-pencil-line" />
              </span>
            </div>
            <div className="group-card-content">
              {bookmarks.map((bookmark) => {
                return (
                  <div
                    key={bookmark.id}
                    className="bookmark-card"
                    onClick={() => onClickCard(bookmark)}
                  >
                    {bookmark.favIconUrl ? (
                      <img className="fav-img" src={bookmark.favIconUrl} />
                    ) : (
                      <i className="ri-window-line fav-img fav-img-icon" />
                    )}
                    <span className="bookmark-title">{bookmark.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookmarkCards;
