import React, { useContext } from "react";
import { format } from "date-fns/esm";
import _keyBy from "lodash/keyBy";

import Button from "components/Button";

import BookmarkModal from "../../../services/BookmarkModal";
import BookmarkGroupModal from "../../../services/BookmarkGroupModal";

import useChromeTabs from "utils/useChromeTabs";
import BookmarkContext from "../BookmarkContext";

const ActiveTabs = (): JSX.Element => {
  const { tabs } = useChromeTabs({ ignoreUrls: ["chrome://newtab/"] });
  const { setGroups, setBookmarks, groups } = useContext(BookmarkContext);

  const onClickSaveSession = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.add({
        name: `Session ${format(new Date(), "d-M-yyyy H:mm:ss")}`,
        icon: "ri-folder-line",
        position: Object.keys(groups).length,
      });
      const response = await BookmarkModal.bulkAdd(
        tabs.map((tab) => {
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
        {tabs.map((tab) => {
          return (
            <div key={tab.id} className="current-list-item">
              {tab.favIconUrl ? (
                <img className="fav-img" src={tab.favIconUrl} />
              ) : (
                <i className="ri-window-line fav-img fav-img-icon" />
              )}
              <span className="tab-title">{tab.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveTabs;
