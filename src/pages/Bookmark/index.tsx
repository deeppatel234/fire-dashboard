import React, { useContext, useEffect } from "react";

import AppContext from "src/AppContext";

import BookmarkModal from "../../services/BookmarkModal";

const Bookmark = (): JSX.Element => {
  const { workspace } = useContext(AppContext);

  const addBookMarks = () => {
    BookmarkModal.insert({
      test: true,
    });
  };

  const loadData = async () => {
    try {
      const response = await BookmarkModal.getAll();
      console.log(response);
    } catch (err) {}
  };

  useEffect(() => {
    loadData();
  }, [workspace]);

  return <div onClick={addBookMarks}>Bookmarkss</div>;
};

export default Bookmark;
