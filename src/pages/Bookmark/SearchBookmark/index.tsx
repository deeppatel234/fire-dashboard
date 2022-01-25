import React, { useState } from "react";

import Button from "components/Button";
import Modal from "components/Modal";

import SearchBar from "./SearchBar";

import "./index.scss";

const SearchBookmark = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);

  const toggleSearchModal = () => {
    setShowSearchModal(!showSearchModal);
  };

  return (
    <>
      <Button link iconLeft="ri-search-line" onClick={toggleSearchModal}>
        Search
      </Button>
      <Modal
        center={false}
        open={showSearchModal}
        onClose={toggleSearchModal}
        classNames={{ root: "search-bar-modal" }}
      >
        <SearchBar />
      </Modal>
    </>
  );
};

export default SearchBookmark;
