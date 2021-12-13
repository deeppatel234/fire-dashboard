import React, { useContext, useState } from "react";

import Button from "components/Button";
import Popover from "components/Popover";
import useChromeTabs from "utils/useChromeTabs";

import Sortable from "../../../../components/DragAndDrop/Sortable";
import BookmarkContext from "../../BookmarkContext";
import BookmarkCard from "../BookmarkCard";

import "./index.scss";

const GroupCard = ({
  groupId,
  isDragComponent,
  isSortingContainer,
}): JSX.Element => {
  const { groups, data, bookmarks } = useContext(BookmarkContext);
  const { removeAllTabs, createTabs } = useChromeTabs();
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);

  const groupData = groups[groupId] || {};

  const dataList = data.items[`Group-${groupId}`] || [];

  const onClickOpenTabs = () => {
    const tabList = dataList.map((id) => {
      const [, , bookmarkId] = id.split("-");
      const intBookmarkId = parseInt(bookmarkId, 10);
      const bookmark = bookmarks[intBookmarkId];

      return {
        url: bookmark.url,
        pinned: bookmark.pinned,
      };
    });

    createTabs(tabList);
  };

  const onClickCloseOpenTabs = async () => {
    await removeAllTabs();
    onClickOpenTabs();
  };

  const renderData = () => {
    return (
      <Sortable id={`Bookmarks-${groupId}`} dataList={dataList}>
        {dataList.map?.((id) => {
          const [type, groupId, bookmarkId] = id.split("-");
          const intGroupId = parseInt(groupId, 10);
          const intBookmarkId = parseInt(bookmarkId, 10);

          return (
            <Sortable.Item
              key={id}
              id={id}
              disabled={isSortingContainer}
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

  const renderOptionPopover = () => {
    return <div>hahaha</div>;
  };

  return (
    <div id={`group-${groupData.id}`} className="group-card-wrapper">
      <div className="group-card-title">
        <div className="drag-icon">
          <i className={`hover-revert ${groupData.icon}`} />
          <i className="ri-more-2-fill hover first" />
          <i className="ri-more-2-fill hover" />
        </div>
        {groupData.name}
        <div className={`options-block ${isOpenOptionPopper ? "show" : ""}`}>
          <Button
            link
            iconLeft="ri-window-line"
            size="small"
            disabled={!dataList.length}
            onClick={onClickOpenTabs}
          >
            Open Tabs
          </Button>
          <Button
            link
            iconLeft="ri-arrow-up-down-line"
            size="small"
            disabled={!dataList.length}
            onClick={onClickCloseOpenTabs}
          >
            Close all open these
          </Button>
          <Popover
            className="group-title-option-popover"
            component={renderOptionPopover()}
            isOpen={isOpenOptionPopper}
            setIsOpen={setIsOpenOptionPopper}
            closeOnClick
          >
            <Button
              link
              iconLeft="ri-arrow-down-s-line"
              size="small"
              disabled={!dataList.length}
              onClick={onClickCloseOpenTabs}
            >
              Options
            </Button>
          </Popover>
        </div>
      </div>
      <div className="group-card-content">
        {isDragComponent ? renderDragData() : renderData()}
        {!dataList.length ? (
          <div className="empty-block">Drag bookmark here</div>
        ) : null}
      </div>
    </div>
  );
};

export default GroupCard;
