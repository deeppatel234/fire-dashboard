import React, { useContext, useMemo } from "react";
import _sortBy from "lodash/sortBy";

import Sortable from "../../../components/DragAndDrop/Sortable";
import BookmarkContext from "../BookmarkContext";
import BookmarkCard from "./BookmarkCard";

const GroupCard = ({ data: groupData, dragProps }): JSX.Element => {
  const { groupedBookmark } = useContext(BookmarkContext);
  const id = groupData.id;

  const sortedBookmarks = useMemo(() => {
    return _sortBy(groupedBookmark[id] || [], "position");
  }, [groupedBookmark[id]]);

  const preparedData = useMemo(() => {
    return sortedBookmarks.map(
      (bookmark) => `BookmarkCard-${bookmark.id}-${groupData.id}`,
    );
  }, [sortedBookmarks]);

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
        <Sortable id={`GroupBookmarkCard-${id}`} dataList={preparedData}>
          {sortedBookmarks.map((bookmark) => {
            const id = `BookmarkCard-${bookmark.id}-${groupData.id}`;

            return (
              <Sortable.Item
                key={id}
                id={id}
                data={bookmark}
                component={BookmarkCard}
              />
            );
          })}
        </Sortable>
      </div>
    </div>
  );
};

export default GroupCard;
