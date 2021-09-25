import React, { useContext, useEffect } from "react";

import AppContext from "src/AppContext";
import Button from "components/Button";

import BookmarkModal from "../../services/BookmarkModal";

import useChromeTabs from "utils/useChromeTabs";

import "./index.scss";

const Bookmark = (): JSX.Element => {
  const { workspace } = useContext(AppContext);
  const { tabs } = useChromeTabs();

  // const addBookMarks = () => {
  //   BookmarkModal.insert({
  //     test: true,
  //   });
  // };

  console.log(tabs);

  const loadData = async () => {
    try {
      const response = await BookmarkModal.getAll();
    } catch (err) {}
  };

  useEffect(() => {
    loadData();
  }, [workspace]);

  return (
    <div className="bookmark-wrapper">
      <div className="group-wrapper">grops</div>
      <div className="card-wrapper">cards</div>
      {tabs?.length ? (
        <div className="current-tab-wrapper">
          <div className="current-tab-header">
            <div className="tab-title">Tabs</div>
            <Button outline size="small">
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
