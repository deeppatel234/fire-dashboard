import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

import Button from "components/Button";

import Sortable from "../../../components/DragAndDrop/Sortable";

import BookmarkContext from "../BookmarkContext";
import NewGroupModal from "../NewGroupModal";
import TabCard from "./TabCard";

import "./index.scss";

const ActiveTabs = ({ isSortingContainer }): JSX.Element => {
  const { createGroupAndAddBookmark, tabIds, getActiveTabsList } =
    useContext(BookmarkContext);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  const onClickSaveSession = async (data) => {
    try {
      await createGroupAndAddBookmark({
        groupData: data,
        bookmarkList: getActiveTabsList(),
      });
      toggleCreateModal();
    } catch (err) {
      toast.error("Unable to save session. Please try again");
    }
  };

  return (
    <div className="current-tab-wrapper">
      <div className="current-tab-header">
        <div className="tab-title">Tabs</div>
        <Button
          outline
          size="small"
          onClick={toggleCreateModal}
          disabled={!tabIds?.length}
        >
          Save Session
        </Button>
      </div>
      <div className="current-tab-list">
        <Sortable id="ActiveTabs" dataList={tabIds}>
          {tabIds.map((id) => {
            return (
              <Sortable.Item
                key={id}
                id={id}
                disabled={isSortingContainer}
                componentProps={{
                  tabId: id,
                }}
                sortableProps={{
                  data: {
                    type: "tab",
                    tabId: id,
                  },
                }}
                component={TabCard}
              />
            );
          })}
        </Sortable>
        {!tabIds?.length ? (
          <div className="empty-block">
            <i className="icon ri-window-line" />
            <div className="title">No active tabs</div>
          </div>
        ) : null}
      </div>
      <NewGroupModal
        isOpen={showCreateModal}
        onConfirm={onClickSaveSession}
        onClose={toggleCreateModal}
      />
    </div>
  );
};

export default ActiveTabs;
