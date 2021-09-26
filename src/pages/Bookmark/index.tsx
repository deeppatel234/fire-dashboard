import React, { useContext, useEffect, useMemo, useState } from "react";
import { format } from "date-fns/esm";
import _keyBy from "lodash/keyBy";
import _groupBy from "lodash/groupBy";

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

  const groupedBookmark = useMemo(() => {
    return _groupBy(bookmarks, "groupId");
  }, [bookmarks]);

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

  const onClickGroup = (id) => {
    document.getElementById(`group-${id}`).scrollIntoView();
  };

  const onClickCreateGroup = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.add({
        name: `Untitled`,
        icon: "ri-folder-line",
      });
      setGroups({ ..._keyBy([groupResponse], "id"), ...groups });
    } catch (err) {
      console.log("err", err);
    }
  };

  const onClickCard = (bookmark) => {
    window.open(bookmark.url, "_self");
  };

  return (
    <div className="bookmark-wrapper">
      <div className="group-wrapper">
        <div className="group-header">
          <div className="group-header-title">Collections</div>
          <Button outline size="small" onClick={onClickCreateGroup}>
            Create
          </Button>
        </div>
        <div className="group-list">
          {Object.keys(groups).map((id) => {
            const group = groups[id];

            return (
              <div
                key={id}
                className="group-list-item"
                onClick={() => onClickGroup(id)}
              >
                <i className={`group-icon ${group.icon}`} />
                <span className="group-list-title">{group.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card-wrapper">
        {Object.keys(groups).map((id) => {
          const bookmarks = groupedBookmark[id] || [];
          const groupData = groups[id] || {};

          return (
            <div key={id} id={`group-${id}`} className="group-card-wrapper">
              <div className="group-card-title">
                {groupData.name}
                <span className="group-name-edit">
                  <i className="ri-pencil-line" />
                </span>
              </div>
              <div className="group-card-content">
                {bookmarks.map((bookmark) => {
                  return (
                    <div
                      key={bookmark.id}
                      className="bookmark-card"
                      onClick={() => onClickCard(bookmark)}
                    >
                      {bookmark.favIconUrl ? (
                        <img className="fav-img" src={bookmark.favIconUrl} />
                      ) : (
                        <i className="ri-window-line fav-img fav-img-icon" />
                      )}
                      <span className="bookmark-title">{bookmark.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
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
