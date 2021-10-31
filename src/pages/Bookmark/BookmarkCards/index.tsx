import React, { useContext } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import BookmarkContext from "../BookmarkContext";
import GroupCard from "./GroupCard";

const BookmarkCards = (): JSX.Element => {
  const { sortedGroupList, updateGroupData } = useContext(BookmarkContext);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sortedGroupList.findIndex((g) => g.id === active.id);
      const newIndex = sortedGroupList.findIndex((g) => g.id === over.id);

      const newValues = arrayMove(sortedGroupList, oldIndex, newIndex);

      updateGroupData(
        newValues.map((val, index) => {
          val.position = index;
          return val;
        }),
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="card-wrapper">
        <SortableContext
          items={sortedGroupList}
          strategy={verticalListSortingStrategy}
        >
          {sortedGroupList.map((groupData) => {
            return <GroupCard key={groupData.id} groupData={groupData} />;
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default BookmarkCards;
