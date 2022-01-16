import React, { useContext, useState } from "react";

import PopoverDropdown from "components/PopoverDropdown";

import BookmarkContext from "../../BookmarkContext";

import "./index.scss";

const BookmarkCard = ({
  type,
  tabId,
  bookmarkId,
  isDragComponent,
}): JSX.Element => {
  const {
    bookmarks,
    tabData,
    updateBookmarkData,
    enableBulkAction,
    bulkActionIds,
    setBulkActionIds,
  } = useContext(BookmarkContext);
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);
  const isBulkSelected = bulkActionIds.includes(bookmarkId);

  const bookmark =
    type === "tab" ? tabData[tabId] : bookmarks[bookmarkId] || {};

  const onClickBookmark = () => {
    if (enableBulkAction) {
      if (isBulkSelected) {
        setBulkActionIds(bulkActionIds.filter((id) => id !== bookmarkId));
      } else {
        setBulkActionIds((ids) => [...ids, bookmarkId]);
      }
    } else {
      window.open(bookmark.url, "_self");
    }
  };

  const onSelectOption = (option) => {
    if (option.key === "DELETE") {
      updateBookmarkData({
        ...bookmark,
        isDeleted: 1,
      });
    }
  };

  return (
    <div
      className={`bookmark-card ${isOpenOptionPopper ? "open" : ""} ${
        enableBulkAction ? "bulk-action" : ""
      } ${isBulkSelected ? "bulk-selected" : ""}`}
      onClick={onClickBookmark}
    >
      {bookmark.favIconUrl ? (
        <img className="fav-img" src={bookmark.favIconUrl} />
      ) : (
        <i className="ri-window-line fav-img fav-img-icon" />
      )}
      <span className="bookmark-title">{bookmark.title}</span>
      {!isDragComponent && !enableBulkAction ? (
        <PopoverDropdown
          placement="bottom-end"
          isOpen={isOpenOptionPopper}
          setIsOpen={setIsOpenOptionPopper}
          onSelect={onSelectOption}
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
      ) : null}
    </div>
  );
};

export default BookmarkCard;
