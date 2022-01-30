import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

import Button from "components/Button";
import useConfirm from "components/Confirm/useConfirm";

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
  const { confirm } = useConfirm();
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

  const deleteBookmarks = async () => {
    const isConfirmed = await confirm({
      message: `Are you sure want to delete ${bulkActionIds.length} bookmarks?`,
    });

    if (isConfirmed) {
      const bookmarkToDelete = bulkActionIds.map((id) => {
        return {
          ...bookmarks[id],
          isDeleted: 1,
        };
      });

      try {
        await updateBookmarkData(bookmarkToDelete);
      } catch (err) {
        toast.error("Unable to delete bookmarks. Please try again");
      }
      onClose();
    }
  };

  const onClickCreate = async (newGroupData) => {
    try {
      await createGroupAndAddBookmark({
        groupData: newGroupData,
        bookmarkList: bulkActionIds.map((id) => {
          return bookmarks[id];
        }),
      });
      setShowCreateModal(false);
      onClose();
    } catch (err) {
      toast.error("Unable to create new collection. Please try again");
    }
  };

  const hasSelected = !!bulkActionIds.length;

  return (
    <div className="bulk-action-panel-wrapper">
      <span className="selected-text">{`${bulkActionIds.length} Selected`}</span>
      <div className="bulk-buttons">
        <div className="left">
          <Button
            iconLeft="ri-download-line"
            link
            onClick={exportData}
            disabled={!hasSelected}
          >
            Export
          </Button>
          <Button
            iconLeft="ri-add-line"
            link
            onClick={toggleCreateModal}
            disabled={!hasSelected}
          >
            Create collection
          </Button>
          <Button
            iconLeft="ri-folder-transfer-line"
            link
            onClick={toggleMergeGroupModal}
            disabled={!hasSelected}
          >
            Move
          </Button>
          <Button
            iconLeft="ri-delete-bin-7-line"
            link
            onClick={deleteBookmarks}
            disabled={!hasSelected}
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
