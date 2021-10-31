import React, { useContext, useState } from "react";
import _keyBy from "lodash/keyBy";
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

import Button from "components/Button";

import BookmarkGroupModal from "../../../services/BookmarkGroupModal";
import CollectionCard from "./CollectionCard";
import BookmarkContext from "../BookmarkContext";

const Collections = (): JSX.Element => {
  const { setGroups, groups, sortedGroupList, updateGroupData } =
    useContext(BookmarkContext);
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

  const onClickCreateGroup = async () => {
    try {
      const groupResponse = await BookmarkGroupModal.add({
        name: `Untitled`,
        icon: "ri-folder-line",
        position: Object.keys(groups).length,
      });
      setGroups({ ..._keyBy([groupResponse], "id"), ...groups });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="group-wrapper">
        <div className="group-header">
          <div className="group-header-title">Collections</div>
          <Button outline size="small" onClick={onClickCreateGroup}>
            Create
          </Button>
        </div>
        <div className="group-list">
          <SortableContext
            id="collection-cards"
            items={sortedGroupList}
            strategy={verticalListSortingStrategy}
          >
            {sortedGroupList.map((group) => {
              return <CollectionCard key={group.id} group={group} />;
            })}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
};

export default Collections;
