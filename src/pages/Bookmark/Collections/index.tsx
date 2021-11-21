import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";
import _keyBy from "lodash/keyBy";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Button from "components/Button";

import BookmarkGroupModal from "../../../services/BookmarkGroupModal";
import CollectionCard from "./CollectionCard";
import BookmarkContext from "../BookmarkContext";
import Sortable from "../../../components/DragAndDrop/Sortable";

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const Collections = (): JSX.Element => {
  const { setGroups, groups, data, updateData } = useContext(BookmarkContext);
  const [activeDrag, setActiveDrag] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragStart = (dragState) => {
    const { active } = dragState;

    setActiveDrag(active?.data?.current?.groupId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      updateData("group", {
        ...data,
        groupIds: arrayMove(
          data.groupIds,
          data.groupIds.indexOf(active.id),
          data.groupIds.indexOf(over.id),
        ),
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
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
          <Sortable
            id="Uber-CollectionCards"
            dataList={data.groupIds || []}
            strategy={verticalListSortingStrategy}
          >
            {data?.groupIds?.map?.((id) => {
              const [, groupId] = id.split("-");
              const intGroupId = parseInt(groupId, 10);

              return (
                <Sortable.Item
                  key={id}
                  id={id}
                  componentProps={{
                    groupId: intGroupId,
                  }}
                  sortableProps={{
                    data: {
                      type: "group",
                      groupId: intGroupId,
                    },
                  }}
                  component={CollectionCard}
                />
              );
            })}
          </Sortable>
        </div>
      </div>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeDrag ? <CollectionCard groupId={activeDrag} /> : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};

export default Collections;
