import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns/esm";
import _keyBy from "lodash/keyBy";

import AppContext from "src/AppContext";
import Button from "components/Button";

import BookmarkModal from "../../services/BookmarkModal";
import BookmarkGroupModal from "../../services/BookmarkGroupModal";

import useChromeTabs from "utils/useChromeTabs";

import "./index.scss";

const Bookmark = (): JSX.Element => {
  const { workspace } = useContext(AppContext);
  const { tabs } = useChromeTabs({ ignoreUrls: ["chrome://newtab/"] });
  const [groups, setGroups] = useState({});
  const [bookmarks, setBookmarks] = useState({});

  const loadData = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.getAll();
      const response = await BookmarkModal.getAll();
      setGroups(_keyBy(groupResponse, "id"));
      setBookmarks(_keyBy(response, "id"));
    } catch (err) {}
  };

  useEffect(() => {
    loadData();
  }, [workspace]);

  const onClickSaveSession = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.add({
        name: `Session ${format(new Date(), "d-M-yyyy H:mm:ss")}`,
        icon: "ri-folder-line",
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
      setGroups({ ..._keyBy([groupResponse], "id"), ...groups });
      setBookmarks({ ..._keyBy(response, "id"), ...bookmarks });
    } catch (err) {
      console.log("err", err);
    }
  };

  console.log(groups, bookmarks);

  return (
    <div className="bookmark-wrapper">
      <div className="group-wrapper">
        {Object.keys(groups).map((id) => {
          const group = groups[id];
          return (
            <div key={id} className="group-list-item">
              <i className={`group-icon ${group.icon}`} />
              <span className="group-list-title">{group.name}</span>
            </div>
          );
        })}
      </div>
      <div className="card-wrapper">cards</div>
      {tabs?.length ? (
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
      ) : null}
    </div>
  );
};

export default Bookmark;
