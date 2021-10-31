import React, { useContext, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import _sortBy from "lodash/sortBy";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import BookmarkContext from "../BookmarkContext";

import BookmarkCard from "./BookmarkCard";

const GroupCard = ({ groupData }): JSX.Element => {
  const { groupedBookmark, updateBookmarkData } = useContext(BookmarkContext);
  const id = groupData.id;

  const sortedBookmarks = useMemo(() => {
    return _sortBy(groupedBookmark[id] || [], "position");
  }, [groupedBookmark[id]]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sortedBookmarks.findIndex((g) => g.id === active.id);
      const newIndex = sortedBookmarks.findIndex((g) => g.id === over.id);

      const newValues = arrayMove(sortedBookmarks, oldIndex, newIndex);

      updateBookmarkData(
        newValues.map((val, index) => {
          val.position = index;
          return val;
        }),
      );
    }
  };

  return (
    <div
      key={id}
      id={`group-${id}`}
      className="group-card-wrapper"
      ref={setNodeRef}
      style={style}
    >
      <div className="group-card-title">
        <div className="drag-icon" {...attributes} {...listeners}>
          <i className="ri-more-2-fill" />
          <i className="ri-more-2-fill" />
        </div>
        {groupData.name}
        <span className="group-name-edit">
          <i className="ri-pencil-line" />
        </span>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="group-card-content">
          <SortableContext
            id={`group-bookmark-card-${groupData.id}`}
            items={sortedBookmarks}
            strategy={rectSortingStrategy}
          >
            {sortedBookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default GroupCard;
