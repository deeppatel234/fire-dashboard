import React, { useContext, useState } from "react";
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

import ActiveTabs from "./ActiveTabs";
import BookmarkCards from "./BookmarkCards";
import Collections from "./Collections";
import GroupCard from "./BookmarkCards/GroupCard";
import BookmarkCard from "./BookmarkCards/BookmarkCard";
import TabCard from "./ActiveTabs/TabCard";

import BookmarkContext from "./BookmarkContext";

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
  const { data, setData, updateData, setDataTabIds } =
    useContext(BookmarkContext);

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

  const findContainer = (id) => {
    if (id in data.items) {
      return id;
    }

    return Object.keys(data.items).find((key) => data.items[key].includes(id));
  };

  const handleDragStart = (dragState) => {
    const { active } = dragState;
    const id = active?.id;
    const { sortable = {}, ...restData } = active?.data?.current;

    if (!id || !sortable.containerId) {
      return null;
    }

    setActiveDrag(restData);
  };

  const handleDragOver = (dragState) => {
    const { active, over, draggingRect } = dragState;
    const { id: activeId } = active || {};
    const { id: overId } = over || {};

    const { type, tabId } = active?.data?.current;

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

    setData((prev) => {
      if (type === "group") {
        return {
          ...prev,
          groupIds: arrayMove(
            prev.groupIds,
            prev.groupIds.indexOf(activeContainer),
            prev.groupIds.indexOf(overContainer),
          ),
        };
      }

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

  const handleDragEnd = (dragState) => {
    const { active, over } = dragState;
    const { id: activeId } = active || {};
    const { id: overId } = over || {};
    const { type } = active?.data?.current;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (type === "group") {
      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        setActiveDrag(null);
        return;
      }
      updateData(type, {
        ...data,
        groupIds: arrayMove(
          data.groupIds,
          data.groupIds.indexOf(activeContainer),
          data.groupIds.indexOf(overContainer),
        ),
      });
    } else if (type === "tab") {
      if (!overContainer) {
        setActiveDrag(null);
        return;
      }

      updateData(type, {
        ...data,
      });
    } else {
      if (
        !activeContainer ||
        !overContainer ||
        activeContainer !== overContainer
      ) {
        setActiveDrag(null);
        return;
      }

      const activeIndex = data.items[activeContainer].indexOf(activeId);
      const overIndex = data.items[overContainer].indexOf(overId);

      if (activeIndex !== overIndex) {
        updateData(type, {
          ...data,
          items: {
            ...data.items,
            [overContainer]: arrayMove(
              data.items[overContainer],
              activeIndex,
              overIndex,
            ),
          },
        });
      }
    }

    setActiveDrag(null);
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
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="bookmark-wrapper">
        <Collections />
        <BookmarkCards />
        <ActiveTabs />
      </div>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeDrag ? renderActiveDrag() : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};

export default BookmarkView;
