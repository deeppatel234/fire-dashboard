import React, { useContext, useState } from "react";

import PopoverDropdown from "components/PopoverDropdown";

import BookmarkContext from "../../BookmarkContext";

import "./index.scss";

const BookmarkCard = ({ type, tabId, bookmarkId }): JSX.Element => {
  const { bookmarks, tabData } = useContext(BookmarkContext);
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);

  const bookmark =
    type === "tab" ? tabData[tabId] : bookmarks[bookmarkId] || {};

  const onClickBookmark = () => {
    window.open(bookmark.url, "_self");
  };

  return (
    <div
      className={`bookmark-card ${isOpenOptionPopper ? "open" : ""}`}
      onClick={onClickBookmark}
    >
      {bookmark.favIconUrl ? (
        <img className="fav-img" src={bookmark.favIconUrl} />
      ) : (
        <i className="ri-window-line fav-img fav-img-icon" />
      )}
      <span className="bookmark-title">{bookmark.title}</span>
      <PopoverDropdown
        placement="bottom-end"
        isOpen={isOpenOptionPopper}
        setIsOpen={setIsOpenOptionPopper}
        options={[
          {
            key: "EDIT_TITLE",
            icon: "ri-pencil-line",
            label: "Edit",
          },
          {
            key: "LINE",
          },
          {
            key: "DELETE",
            icon: "ri-delete-bin-7-line",
            label: "Delete",
            className: "error-color",
          },
        ]}
      >
        <div className="option-btn">
          <i className="icon ri-arrow-down-s-line" />
        </div>
      </PopoverDropdown>
    </div>
  );
};

export default BookmarkCard;
