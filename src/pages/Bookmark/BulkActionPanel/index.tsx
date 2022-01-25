import React, { useContext, useState } from "react";

import Button from "components/Button";

import BookmarkContext from "../BookmarkContext";
import MergeCollectionModal from "../MergeCollectionModal";
import NewGroupModal from "../NewGroupModal";
import { exportBookmark } from "../utils";

import "./index.scss";

const BulkActionPanel = () => {
  const {
    bookmarks,
    updateBookmarkData,
    setEnableBulkAction,
    bulkActionIds,
    setBulkActionIds,
    createGroupAndAddBookmark,
  } = useContext(BookmarkContext);
  const [showMergeGroupModal, setShowMergeGroupModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleMergeGroupModal = () => {
    setShowMergeGroupModal(!showMergeGroupModal);
  };

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  const onClose = () => {
    setEnableBulkAction(false);
    setBulkActionIds([]);
  };

  const onCompleteMove = () => {
    setShowMergeGroupModal(false);
    onClose();
  };

  const exportData = () => {
    const bookmarkToExport = bulkActionIds.map((id) => {
      return {
        title: bookmarks[id].title,
        url: bookmarks[id].url,
        pinned: bookmarks[id].pinned,
        favIconUrl: bookmarks[id].favIconUrl,
      };
    });

    exportBookmark(bookmarkToExport);
    onClose();
  };

  const deleteBookmarks = () => {
    const bookmarkToDelete = bulkActionIds.map((id) => {
      return {
        ...bookmarks[id],
        isDeleted: 1,
      };
    });

    updateBookmarkData(bookmarkToDelete);
    onClose();
  };

  const onClickCreate = (newGroupData) => {
    createGroupAndAddBookmark({
      groupData: newGroupData,
      bookmarkList: bulkActionIds.map((id) => {
        return bookmarks[id];
      }),
    });
    setShowCreateModal(false);
    onClose();
  };

  return (
    <div className="bulk-action-panel-wrapper">
      <span className="selected-text">{`${bulkActionIds.length} Selected`}</span>
      <div className="bulk-buttons">
        <div className="left">
          <Button iconLeft="ri-download-line" link onClick={exportData}>
            Export
          </Button>
          <Button iconLeft="ri-add-line" link onClick={toggleCreateModal}>
            Create collection
          </Button>
          <Button
            iconLeft="ri-folder-transfer-line"
            link
            onClick={toggleMergeGroupModal}
          >
            Move
          </Button>
          <Button
            iconLeft="ri-delete-bin-7-line"
            link
            onClick={deleteBookmarks}
          >
            Delete
          </Button>
        </div>
        <div className="right">
          <Button iconLeft="ri-close-line" link onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      <MergeCollectionModal
        moveBookmarks={bulkActionIds}
        isOpen={showMergeGroupModal}
        onClose={toggleMergeGroupModal}
        onDone={onCompleteMove}
      />
      <NewGroupModal
        isOpen={showCreateModal}
        onConfirm={onClickCreate}
        onClose={toggleCreateModal}
      />
    </div>
  );
};

export default BulkActionPanel;
