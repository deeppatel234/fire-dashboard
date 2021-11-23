import React, { useContext } from "react";

import Sortable from "../../../components/DragAndDrop/Sortable";
import BookmarkContext from "../BookmarkContext";
import BookmarkCard from "./BookmarkCard";

const GroupCard = ({ groupId, dragProps, isDragComponent }): JSX.Element => {
  const { groups, data } = useContext(BookmarkContext);

  const groupData = groups[groupId] || {};

  const renderData = () => {
    return (
      <Sortable
        id={`Bookmarks-${groupId}`}
        dataList={data.items[`Group-${groupId}`] || []}
      >
        {data.items[`Group-${groupId}`]?.map?.((id) => {
          const [type, groupId, bookmarkId] = id.split("-");
          const intGroupId = parseInt(groupId, 10);
          const intBookmarkId = parseInt(bookmarkId, 10);

          return (
            <Sortable.Item
              key={id}
              id={id}
              componentProps={{
                type,
                groupId: intGroupId,
                bookmarkId: intBookmarkId,
                tabId: groupId,
              }}
              sortableProps={{
                data: {
                  type: "bookmark",
                  groupId: intGroupId,
                  bookmarkId: intBookmarkId,
                },
              }}
              isDragComponent={type === "tab"}
              component={BookmarkCard}
            />
          );
        })}
      </Sortable>
    );
  };

  const renderDragData = () => {
    return data.items[`Group-${groupId}`]?.map?.((id) => {
      const [, groupId, bookmarkId] = id.split("-");
      const intGroupId = parseInt(groupId, 10);
      const intBookmarkId = parseInt(bookmarkId, 10);

      return (
        <BookmarkCard
          key={id}
          type="bookmark"
          groupId={intGroupId}
          bookmarkId={intBookmarkId}
        />
      );
    });
  };

  return (
    <div className="group-card-wrapper">
      <div className="group-card-title">
        <div className="drag-icon" {...dragProps}>
          <i className="ri-more-2-fill" />
          <i className="ri-more-2-fill" />
        </div>
        {groupData.name}
        <span className="group-name-edit">
          <i className="ri-pencil-line" />
        </span>
      </div>
      <div className="group-card-content">
        {isDragComponent ? renderDragData() : renderData()}
      </div>
    </div>
  );
};

export default GroupCard;
