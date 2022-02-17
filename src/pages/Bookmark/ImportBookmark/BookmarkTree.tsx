import React, { useContext, useEffect, useMemo, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import { toast } from "react-toastify";

import Modal from "components/Modal";
import Button from "components/Button";
import NewGroupModal from "../NewGroupModal";
import BookmarkContext from "../BookmarkContext";

import "react-checkbox-tree/src/scss/react-checkbox-tree.scss";

const BookmarkTree = ({ onClose }) => {
  const { createGroupAndAddBookmark } = useContext(BookmarkContext);
  const [tree, setTree] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleCreateGroup = () => {
    setShowCreateModal(!showCreateModal);
  };

  const prepareData = (data) => {
    const nodeTree = [];

    data.forEach((d) => {
      const children = prepareData(d.children || []);
      if (children.length) {
        nodeTree.push({
          value: d.id,
          label: d.title,
          children,
        });
      } else {
        if (d.url) {
          nodeTree.push({
            value: d.id,
            label: d.title,
          });
        }
      }
    });

    return nodeTree;
  };

  const nodes = useMemo(() => {
    return prepareData(tree);
  }, [tree]);

  const getBookmarks = () => {
    chrome.bookmarks.getTree((data) => {
      setTree(data?.[0]?.children || []);
    });
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  const onSubmit = (data) => {
    toggleCreateGroup();
    chrome.bookmarks.get(checked, async (bookmarks) => {
      try {
        await createGroupAndAddBookmark({
          groupData: data,
          bookmarkList: bookmarks.map((b) => ({
            title: b.title,
            url: b.url,
          })),
        });
        onClose();
      } catch (err) {
        toast.error("Unable to import bookmarks. Please try again");
      }
    });
  };

  return (
    <>
      <Modal.Header>Import Bookmark</Modal.Header>
      <Modal.Body>
        <CheckboxTree
          showExpandAll
          nodes={nodes}
          checked={checked}
          expanded={expanded}
          onCheck={setChecked}
          onExpand={setExpanded}
          icons={{
            check: <span className="ri-checkbox-line" />,
            uncheck: <span className="ri-checkbox-blank-line" />,
            halfCheck: <span className="ri-checkbox-indeterminate-line" />,
            expandClose: <span className="ri-arrow-right-s-line" />,
            expandOpen: <span className="ri-arrow-down-s-line" />,
            expandAll: <span className="ri-add-box-line" />,
            collapseAll: <span className="ri-checkbox-indeterminate-line" />,
            parentClose: <span className="ri-folder-line" />,
            parentOpen: <span className="ri-folder-open-line" />,
            leaf: <span className="ri-bookmark-line" />,
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!checked.length} onClick={toggleCreateGroup}>
          Import
        </Button>
        <Button type="default" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
      <NewGroupModal
        isOpen={showCreateModal}
        onConfirm={onSubmit}
        onClose={toggleCreateGroup}
      />
    </>
  );
};

export default BookmarkTree;
