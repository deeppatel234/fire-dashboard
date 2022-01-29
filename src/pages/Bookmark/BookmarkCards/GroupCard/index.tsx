import React, { useContext, useState } from "react";
import classNames from "classnames";

import Button from "components/Button";
import PopoverDropdown from "components/PopoverDropdown";
import useChromeTabs from "utils/useChromeTabs";

import Sortable from "../../../../components/DragAndDrop/Sortable";
import BookmarkContext from "../../BookmarkContext";
import BookmarkCard from "../BookmarkCard";
import NewGroupModal from "../../NewGroupModal";
import MergeCollectionModal from "../../MergeCollectionModal";
import { exportBookmark, getId } from "../../utils";

import "./index.scss";

const GroupCard = ({
  groupId,
  isDragComponent,
  isSortingContainer,
}): JSX.Element => {
  const {
    groups,
    data,
    bookmarks,
    updateGroupData,
    updateBookmarkData,
    tabIds,
    getActiveTabsList,
  } = useContext(BookmarkContext);
  const { removeAllTabs, createTabs } = useChromeTabs();
  const [isOpenOptionPopper, setIsOpenOptionPopper] = useState(false);
  const [showUpdateTitleModal, setShowUpdateTitleModal] = useState(false);
  const [showMergeGroupModal, setShowMergeGroupModal] = useState(false);

  const groupData = groups[groupId] || {};

  const dataList = data.items[`Group-${groupId}`] || [];

  const toggleUpdateTitleModal = () => {
    setShowUpdateTitleModal(!showUpdateTitleModal);
  };

  const toggleMergeGroupModal = () => {
    setShowMergeGroupModal(!showMergeGroupModal);
  };

  const onClickOpenTabs = () => {
    const tabList = dataList.map((id) => {
      const { bookmarkId } = getId(id);

      const bookmark = bookmarks[bookmarkId];

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

  const onClickUpdateGroup = (newDate) => {
    toggleUpdateTitleModal();
    updateGroupData({
      ...groupData,
      ...newDate,
    });
  };

  const deleteGroup = () => {
    updateGroupData({
      ...groupData,
      isDeleted: 1,
    });
    if (dataList?.length) {
      updateBookmarkData(
        dataList.map((id) => {
          const { bookmarkId } = getId(id);
          const bookmark = bookmarks[bookmarkId];

          return { ...bookmark, isDeleted: 1 };
        }),
      );
    }
  };

  const moveToTop = () => {
    const newPosData = [];
    let counter = 1;

    data.groupIds.forEach((id) => {
      const { groupId } = getId(id);

      if (groupId === groupData.id) {
        newPosData.unshift({
          ...groups[groupId],
          position: 0,
        });
      } else {
        newPosData.push({
          ...groups[groupId],
          position: counter,
        });
        counter += 1;
      }
    });

    updateGroupData(newPosData);
  };

  const importOpenTabs = () => {
    const bookmarkList = getActiveTabsList().map((b, index) => ({
      ...b,
      groupId: groupData.id,
      position: dataList.length + index,
    }));

    updateBookmarkData(bookmarkList);
  };

  const exportCollection = () => {
    const bookmarkToExport = dataList.map((id) => {
      const { bookmarkId } = getId(id);

      return {
        title: bookmarks[bookmarkId].title,
        url: bookmarks[bookmarkId].url,
        pinned: bookmarks[bookmarkId].pinned,
        favIconUrl: bookmarks[bookmarkId].favIconUrl,
      };
    });

    exportBookmark(bookmarkToExport);
  };

  const onSelectOption = (option) => {
    if (option.key === "DELETE") {
      deleteGroup();
    } else if (option.key === "EDIT_TITLE") {
      toggleUpdateTitleModal();
    } else if (option.key === "MOVE_TO_TOP") {
      moveToTop();
    } else if (option.key === "IMPORT_OPEN_TABS") {
      importOpenTabs();
    } else if (option.key === "MERGE_COLLECTION") {
      toggleMergeGroupModal();
    } else if (option.key === "EXPORT_COLLECTION") {
      exportCollection();
    }
  };

  const toggleCollapse = () => {
    updateGroupData({
      ...groupData,
      collapse: !groupData.collapse,
    });
  };

  const renderData = () => {
    return (
      <Sortable id={`Bookmarks-${groupId}`} dataList={dataList}>
        {dataList.map?.((id) => {
          const { type, groupId, bookmarkId } = getId(id);

          return (
            <Sortable.Item
              key={id}
              id={id}
              disabled={isSortingContainer}
              componentProps={{
                type,
                groupId,
                bookmarkId,
                tabId: groupId,
              }}
              sortableProps={{
                data: {
                  type: "bookmark",
                  groupId,
                  bookmarkId,
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
      const { groupId, bookmarkId } = getId(id);

      return (
        <BookmarkCard
          key={id}
          type="bookmark"
          groupId={groupId}
          bookmarkId={bookmarkId}
        />
      );
    });
  };

  return (
    <div id={`group-${groupData.id}`} className="group-card-wrapper">
      <div className="group-card-title">
        <div className="drag-icon">
          <i className={classNames("hover-revert", groupData.icon)} />
          <i className="ri-more-2-fill hover first" />
          <i className="ri-more-2-fill hover" />
        </div>
        <div className="group-name" onClick={toggleCollapse}>
          {groupData.name}
          <i
            className={classNames("icon-collapse", {
              "ri-arrow-up-s-line": groupData?.collapse,
              "ri-arrow-down-s-line": !groupData?.collapse,
            })}
          />
        </div>
        <div
          className={classNames("options-block", {
            show: isOpenOptionPopper,
          })}
        >
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
          <PopoverDropdown
            isOpen={isOpenOptionPopper}
            setIsOpen={setIsOpenOptionPopper}
            onSelect={onSelectOption}
            options={[
              {
                key: "EDIT_TITLE",
                icon: "ri-pencil-line",
                label: "Edit Title",
              },
              {
                key: "MOVE_TO_TOP",
                icon: "ri-layout-top-2-line",
                label: "Move to Top",
              },
              {
                key: "LINE",
              },
              {
                key: "MERGE_COLLECTION",
                icon: "ri-folder-transfer-line",
                label: "Merge Collection",
                disabled: !dataList.length,
              },
              {
                key: "IMPORT_OPEN_TABS",
                icon: "ri-folder-add-line",
                label: "Import Open Tabs",
                disabled: !tabIds.length,
              },
              {
                key: "EXPORT_COLLECTION",
                icon: "ri-download-line",
                label: "Export Collection",
                disabled: !dataList.length,
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
            <Button
              link
              iconLeft="ri-arrow-down-s-line"
              size="small"
              onClick={onClickCloseOpenTabs}
            >
              Options
            </Button>
          </PopoverDropdown>
        </div>
      </div>
      {!groupData?.collapse ? (
        <div className="group-card-content">
          {isDragComponent ? renderDragData() : renderData()}
          {!dataList.length ? (
            <div className="empty-block">Drag bookmark here</div>
          ) : null}
        </div>
      ) : null}
      <NewGroupModal
        dataToUpdate={groupData}
        isOpen={showUpdateTitleModal}
        onConfirm={onClickUpdateGroup}
        onClose={toggleUpdateTitleModal}
      />
      <MergeCollectionModal
        groupToMerge={groupData}
        isOpen={showMergeGroupModal}
        onClose={toggleMergeGroupModal}
        onDone={toggleMergeGroupModal}
      />
    </div>
  );
};

export default GroupCard;
