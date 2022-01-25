import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
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

import CollectionCard from "./CollectionCard";
import BookmarkContext from "../BookmarkContext";
import Sortable from "../../../components/DragAndDrop/Sortable";
import NewGroupModal from "../NewGroupModal";
import { getId } from "../utils";

import "./index.scss";

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const Collections = (): JSX.Element => {
  const { createNewGroup, positions, updatePositions } = useContext(BookmarkContext);
  const [activeDrag, setActiveDrag] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleCreateModal = () => {
    setShowCreateModal(!showCreateModal);
  };

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

  const onClickCreateGroup = async (newData) => {
    try {
      await createNewGroup(newData);
      toggleCreateModal();
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleDragStart = (dragState) => {
    const { active } = dragState;

    setActiveDrag(active?.positions?.current?.groupId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      updatePositions("group", {
        ...positions,
        groupIds: arrayMove(
          positions.groupIds,
          positions.groupIds.indexOf(active.id),
          positions.groupIds.indexOf(over.id),
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
      <div className="collection-group-wrapper">
        <div className="group-header">
          <div className="group-header-title">Collections</div>
          <Button outline size="small" onClick={toggleCreateModal}>
            Create
          </Button>
        </div>
        <div className="group-list">
          <Sortable
            id="Uber-CollectionCards"
            dataList={positions.groupIds || []}
            strategy={verticalListSortingStrategy}
          >
            {positions?.groupIds?.map?.((id) => {
              const { groupId } = getId(id);

              return (
                <Sortable.Item
                  key={id}
                  id={id}
                  componentProps={{
                    groupId,
                  }}
                  sortableProps={{
                    data: {
                      type: "group",
                      groupId,
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
      <NewGroupModal
        isOpen={showCreateModal}
        onConfirm={onClickCreateGroup}
        onClose={toggleCreateModal}
      />
    </DndContext>
  );
};

export default Collections;
