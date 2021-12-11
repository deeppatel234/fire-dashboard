import React, { useContext, useState } from "react";
import _keyBy from "lodash/keyBy";

import Button from "components/Button";

import BookmarkModal from "../../../services/BookmarkModal";
import BookmarkGroupModal from "../../../services/BookmarkGroupModal";
import Sortable from "../../../components/DragAndDrop/Sortable";

import BookmarkContext from "../BookmarkContext";
import NewGroupModal from "../NewGroupModal";
import TabCard from "./TabCard";

const ActiveTabs = (): JSX.Element => {
  const { setGroups, setBookmarks, groups, dataTabIds, tabData } = useContext(BookmarkContext);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  const onClickSaveSession = async (data) => {
    try {
      const groupResponse = await BookmarkGroupModal.add({
        ...data,
        position: Object.keys(groups).length,
      });
      const response = await BookmarkModal.bulkAdd(
        dataTabIds.map((id) => {
          const tab = tabData[id];
          return {
            favIconUrl: tab.favIconUrl,
            url: tab.url,
            title: tab.title,
            groupId: groupResponse.id,
          };
        }),
      );
      setGroups((groups) => ({ ..._keyBy([groupResponse], "id"), ...groups }));
      setBookmarks((bookmarks) => ({
        ..._keyBy(response, "id"),
        ...bookmarks,
      }));
      toggleCreateModal();
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="current-tab-wrapper">
      <div className="current-tab-header">
        <div className="tab-title">Tabs</div>
        <Button outline size="small" onClick={toggleCreateModal}>
          Save Session
        </Button>
      </div>
      <div className="current-tab-list">
        <Sortable id="ActiveTabs" dataList={dataTabIds}>
          {dataTabIds.map((id) => {
            return (
              <Sortable.Item
                key={id}
                id={id}
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
