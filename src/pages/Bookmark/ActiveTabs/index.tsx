import React, { useContext } from "react";
import { format } from "date-fns/esm";
import _keyBy from "lodash/keyBy";

import Button from "components/Button";

import BookmarkModal from "../../../services/BookmarkModal";
import BookmarkGroupModal from "../../../services/BookmarkGroupModal";
import Sortable from "../../../components/DragAndDrop/Sortable";

import BookmarkContext from "../BookmarkContext";
import TabCard from "./TabCard";

const ActiveTabs = (): JSX.Element => {
  const { setGroups, setBookmarks, groups, dataTabIds, tabData } = useContext(BookmarkContext);

  const onClickSaveSession = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.add({
        name: `Session ${format(new Date(), "d-M-yyyy H:mm:ss")}`,
        icon: "ri-folder-line",
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
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="current-tab-wrapper">
      <div className="current-tab-header">
        <div className="tab-title">Tabs</div>
        <Button outline size="small" onClick={onClickSaveSession}>
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
    </div>
  );
};

export default ActiveTabs;
