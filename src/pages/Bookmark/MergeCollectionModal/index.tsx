import React, { useContext, useMemo, useState } from "react";

import Modal from "components/Modal";
import Button from "components/Button";
import Select from "components/Select";

import BookmarkContext from "../BookmarkContext";

import "./index.scss";

const MergeCollectionModal = ({ groupToMerge, isOpen, onClose }) => {
  const { groups, bookmarks, updateBookmarkData } = useContext(BookmarkContext);
  const [selected, setSelected] = useState(null);

  const groupList = useMemo(() => {
    return Object.values(groups)
      .map((g) => ({ value: g.id, label: g.name }))
      .filter((g) => g.value !== groupToMerge.id);
  }, [groups, groupToMerge]);

  const close = () => {
    setSelected(null);
    onClose();
  };

  const onSubmit = () => {
    const bookmarkToMove = Object.values(bookmarks).filter(
      (b) => b.groupId === groupToMerge.id,
    );
    const bookmarkToMoveIn = Object.values(bookmarks).filter(
      (b) => b.groupId === selected.value,
    );

    const bookmarkList = bookmarkToMove.map((b, index) => ({
      ...b,
      groupId: selected.value,
      position: bookmarkToMoveIn.length + index,
    }));

    updateBookmarkData(bookmarkList);
    close();
  };

  return (
    <Modal
      classNames={{ root: "merge-group-modal" }}
      open={isOpen}
      onClose={close}
    >
      <Modal.Header>Merge Collection</Modal.Header>
      <Modal.Body>
        <div className="content">
          <div className="title">Select collection for merge in</div>
          <Select options={groupList} value={selected} onChange={setSelected} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSubmit}>Merge</Button>
        <Button type="default" onClick={close}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MergeCollectionModal;
