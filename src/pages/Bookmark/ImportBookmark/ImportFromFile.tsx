import React, { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import CheckboxTree from "react-checkbox-tree";
import _unionBy from "lodash/unionBy";

import FileUpload from "components/FileUpload";
import Modal from "components/Modal";
import Button from "components/Button";

import BookmarkContext from "../BookmarkContext";
import NewGroupModal from "../NewGroupModal";

import "./index.scss";

const ImportFromFile = ({ onClose }) => {
  const { createGroupAndAddBookmark } = useContext(BookmarkContext);
  const [dataToUpload, setDataToUpload] = useState(null);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState(["all"]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleCreateGroup = () => {
    setShowCreateModal(!showCreateModal);
  };

  const onFileUpload = (files) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const paresedData = JSON.parse(event?.target?.result);
        if (paresedData?.bookmarkList?.length) {
          setDataToUpload(paresedData);
        } else {
          throw {};
        }
      } catch (err) {
        toast.error("Please upload valid json file");
      }
    };

    reader.readAsText(files[0]);
  };

  const onSubmit = async (groupData) => {
    const dataToSave = checked.map((url) => {
      return dataToUpload?.bookmarkList.find((b) => b.url === url);
    });

    try {
      await createGroupAndAddBookmark({
        groupData,
        bookmarkList: dataToSave.map((b) => ({
          title: b.title,
          url: b.url,
          pinned: b.pinned,
          favIconUrl: b.favIconUrl,
        })),
      });
      onClose();
    } catch (err) {
      toast.error("Unable to import bookmarks. Please try again");
    }
  };

  const nodes = useMemo(() => {
    const bookmarkList = _unionBy(dataToUpload?.bookmarkList || [], "url").map(
      (bookmark) => {
        return {
          value: bookmark.url,
          label: bookmark.title,
        };
      },
    );

    return [
      {
        value: "all",
        label: "Bookmarks",
        children: bookmarkList,
      },
    ];
  }, [dataToUpload]);

  return (
    <>
      <Modal.Header>Upload File</Modal.Header>
      <Modal.Body className="import-from-file-wrapper">
        {dataToUpload ? (
          <>
            <div className="header">
              <div>Uploaded Data</div>
              <Button onClick={() => setDataToUpload(null)}>
                Upload New File
              </Button>
            </div>
            <CheckboxTree
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
                collapseAll: (
                  <span className="ri-checkbox-indeterminate-line" />
                ),
                parentClose: <span className="ri-folder-line" />,
                parentOpen: <span className="ri-folder-open-line" />,
                leaf: <span className="ri-bookmark-line" />,
              }}
            />
          </>
        ) : (
          <FileUpload onChange={onFileUpload} accept="application/json" />
        )}
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

export default ImportFromFile;
