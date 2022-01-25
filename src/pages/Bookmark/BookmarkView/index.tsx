import React, { useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DndContext,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
  MouseSensor,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Button from "components/Button";

import ActiveTabs from "../ActiveTabs";
import BookmarkCards from "../BookmarkCards";
import Collections from "../Collections";
import GroupCard from "../BookmarkCards/GroupCard";
import BookmarkCard from "../BookmarkCards/BookmarkCard";
import TabCard from "../ActiveTabs/TabCard";

import BookmarkContext from "../BookmarkContext";
import NewGroupDrop from "../NewGroupDrop";
import NewGroupModal from "../NewGroupModal";
import ImportBookmark from "../ImportBookmark";
import BulkActionPanel from "../BulkActionPanel";

import "./index.scss";

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const DragElements = {
  group: GroupCard,
  bookmark: BookmarkCard,
  tab: TabCard,
};

const BookmarkView = (): JSX.Element => {
  const {
    positions,
    setPositions,
    updatePositions,
    bookmarks,
    createGroupAndAddBookmark,
    tabData,
    resetData,
    groups,
    updateGroupData,
    enableBulkAction,
    setEnableBulkAction,
  } = useContext(BookmarkContext);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activeDrag, setActiveDrag] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNewGroupDrop, setShowNewGroupDrop] = useState(false);
  const cancelResolveRef = useRef({});

  const isSortingContainer = activeDrag ? activeDrag.type === "group" : false;

  const findContainer = (id) => {
    if (id in positions.items) {
      return id;
    }

    return Object.keys(positions.items).find((key) => positions.items[key].includes(id));
  };

  const handleDragStart = (dragState) => {
    const { active } = dragState;
    const id = active?.id;
    const { sortable = {}, ...restData } = active?.data?.current;

    if (!id || !restData.type) {
      return null;
    }

    setActiveDrag(restData);

    if (["tab", "bookmark"].includes(restData.type)) {
      setShowNewGroupDrop(true);
    }
  };

  const handleDragOver = (dragState) => {
    const { active, over, draggingRect } = dragState;
    const { id: activeId } = active || {};
    const { id: overId } = over || {};

    if (!overId || overId === "NewGroupDroppable") {
      resetData();
      return;
    }

    const { type, tabId } = active?.data?.current;

    if (type === "group") {
      return;
    }

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (type === "tab") {
      if (!overContainer) {
        return;
      }
    } else if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setPositions((prev) => {
      const overItems = prev.items[overContainer];

      // Find the indexes for the items
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev.items) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      if (type === "tab") {
        Object.keys(prev.items).forEach((k) => {
          prev.items[k] = prev.items[k].filter((i) => !i.startsWith("tab"));
        });

        return {
          ...prev,
          items: {
            ...prev.items,
            [overContainer]: [
              ...prev.items[overContainer].slice(0, newIndex),
              `tab-${tabId}`,
              ...prev.items[overContainer].slice(
                newIndex,
                prev.items[overContainer].length,
              ),
            ],
          },
        };
      }

      const activeItems = prev.items[activeContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.indexOf(activeId);

      return {
        ...prev,
        items: {
          ...prev.items,
          [activeContainer]: [
            ...prev.items[activeContainer].filter((item) => item !== active.id),
          ],
          [overContainer]: [
            ...prev.items[overContainer].slice(0, newIndex),
            prev.items[activeContainer][activeIndex],
            ...prev.items[overContainer].slice(
              newIndex,
              prev.items[overContainer].length,
            ),
          ],
        },
      };
    });
  };

  const cleanOnEnd = () => {
    if (showNewGroupDrop) {
      setShowNewGroupDrop(false);
    }
    setActiveDrag(null);
    cancelResolveRef.current = {};
  };

  const handleDragEnd = (dragState) => {
    const { active, over } = dragState;
    const { id: activeId } = active || {};
    const { id: overId } = over || {};
    const { type, tabId, bookmarkId } = active?.data?.current;

    if (overId === "NewGroupDroppable") {
      if (type === "tab") {
        const tab = tabData[tabId];
        createGroupAndAddBookmark({
          bookmarkData: {
            favIconUrl: tab.favIconUrl,
            url: tab.url,
            title: tab.title,
          },
          groupData: cancelResolveRef.current.data,
        });
      } else if (type === "bookmark") {
        const bookmark = bookmarks[bookmarkId];
        createGroupAndAddBookmark({
          bookmarkData: bookmark,
          groupData: cancelResolveRef.current.data,
        });
      }
      cleanOnEnd();
      return;
    }

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (type === "group") {
      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        cleanOnEnd();
        return;
      }
      updatePositions(type, {
        ...positions,
        groupIds: arrayMove(
          positions.groupIds,
          positions.groupIds.indexOf(activeContainer),
          positions.groupIds.indexOf(overContainer),
        ),
      });
    } else if (type === "tab") {
      if (!overContainer) {
        cleanOnEnd();
        return;
      }

      updatePositions(type, {
        ...positions,
      });
    } else {
      if (
        !activeContainer ||
        !overContainer ||
        activeContainer !== overContainer
      ) {
        cleanOnEnd();
        return;
      }

      const activeIndex = positions.items[activeContainer].indexOf(activeId);
      const overIndex = positions.items[overContainer].indexOf(overId);

      if (activeIndex !== overIndex) {
        updatePositions(type, {
          ...positions,
          items: {
            ...positions.items,
            [overContainer]: arrayMove(
              positions.items[overContainer],
              activeIndex,
              overIndex,
            ),
          },
        });
      }
    }

    cleanOnEnd();
  };

  const onDragCancel = () => {
    cleanOnEnd();
    resetData();
  };

  const cancelDrop = async ({ over }) => {
    if (over?.id !== "NewGroupDroppable") {
      return false;
    }

    setActiveDrag(null);
    setShowCreateModal(true);

    const confirmed = await new Promise<boolean>((resolve) => {
      cancelResolveRef.current.callback = resolve;
    });

    return confirmed === false;
  };

  const onClickExpandAll = () => {
    const groupsToUpdate = [];

    Object.values(groups).forEach((group) => {
      if (group.collapse) {
        groupsToUpdate.push({
          ...group,
          collapse: false,
        });
      }
    });

    if (groupsToUpdate.length) {
      updateGroupData(groupsToUpdate);
    }
  };

  const onClickCollapseAll = () => {
    const groupsToUpdate = [];

    Object.values(groups).forEach((group) => {
      if (!group.collapse) {
        groupsToUpdate.push({
          ...group,
          collapse: true,
        });
      }
    });

    if (groupsToUpdate.length) {
      updateGroupData(groupsToUpdate);
    }
  };

  const toggleBulkAction = () => {
    setEnableBulkAction(!enableBulkAction);
  };

  const renderActiveDrag = () => {
    const Component = DragElements[activeDrag.type];

    if (!Component) {
      return null;
    }

    return <Component {...activeDrag} isDragComponent />;
  };

  return (
    <DndContext
      sensors={sensors}
      cancelDrop={cancelDrop}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="bookmark-wrapper">
        {showNewGroupDrop ? <NewGroupDrop /> : null}
        <Collections />
        <div className="bookmark-body-wrapper">
          {enableBulkAction ? (
            <BulkActionPanel />
          ) : (
            <div className="bookmark-header">
              <Button
                link
                iconLeft="ri-arrow-down-s-line"
                onClick={onClickExpandAll}
              >
                Expand All
              </Button>
              <Button
                link
                iconLeft="ri-arrow-up-s-line"
                onClick={onClickCollapseAll}
              >
                Collapse All
              </Button>
              <ImportBookmark />
              <Button
                link
                iconLeft="ri-search-line"
                // onClick={onClickCollapseAll}
              >
                Search
              </Button>
              <Button
                link
                iconLeft="ri-checkbox-multiple-line"
                onClick={toggleBulkAction}
              >
                Bulk Actions
              </Button>
            </div>
          )}
          <BookmarkCards isSortingContainer={isSortingContainer} />
        </div>
        <ActiveTabs isSortingContainer={isSortingContainer} />
      </div>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeDrag ? renderActiveDrag() : null}
        </DragOverlay>,
        document.body,
      )}
      <NewGroupModal
        isOpen={showCreateModal}
        onConfirm={(data) => {
          setShowCreateModal(false);
          cancelResolveRef.current.data = data;
          cancelResolveRef.current.callback(true);
        }}
        onClose={() => {
          setShowCreateModal(false);
          cancelResolveRef.current.callback(false);
        }}
      />
    </DndContext>
  );
};

export default BookmarkView;
