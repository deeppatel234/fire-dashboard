import React, { useContext, useMemo, useState } from "react";
import _groupBy from "lodash/groupBy";
import _isEmpty from "lodash/isEmpty";

import Input from "components/Input";
import useChromeTabs from "utils/useChromeTabs";

import BookmarkContext from "../BookmarkContext";

const SearchBar = () => {
  const { bookmarks, groups } = useContext(BookmarkContext);
  const { createTabs } = useChromeTabs({ listnerTabs: false });

  const [searchTerm, setSearchTerm] = useState("");

  const results = useMemo(() => {
    const searchedBookmarks = Object.values(bookmarks).filter((bookmark) => {
      if (
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return true;
      }

      return false;
    });

    return _groupBy(searchedBookmarks, "groupId");
  }, [searchTerm, bookmarks]);

  const onClickBookmark = (bookmark) => {
    createTabs([{ url: bookmark.url, pinned: bookmark.pinned }]);
  };

  return (
    <div className="search-bar">
      <Input
        placeholder="Search"
        onChangeValue={setSearchTerm}
        value={searchTerm}
      />
      {searchTerm ? (
        <>
          {_isEmpty(results) ? (
            <div className="empty-body">No results found</div>
          ) : (
            <div className="search-body">
              {Object.keys(results).map((groupId) => {
                return (
                  <div key={groupId} className="group-bar">
                    <div className="group-title">{groups?.[groupId]?.name}</div>
                    {results[groupId].map((bookmark) => {
                      return (
                        <div
                          key={bookmark.id}
                          className="bookmark-bar"
                          onClick={() => onClickBookmark(bookmark)}
                        >
                          {bookmark.favIconUrl ? (
                            <img
                              className="fav-img"
                              src={bookmark.favIconUrl}
                            />
                          ) : (
                            <i className="ri-window-line fav-img fav-img-icon" />
                          )}
                          <div className="details">
                            <div className="title text-ellipsis">
                              {bookmark.title}
                            </div>
                            <div className="url text-ellipsis">
                              {bookmark.url}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default SearchBar;
