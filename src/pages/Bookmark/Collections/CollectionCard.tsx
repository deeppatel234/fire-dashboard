import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CollectionCard = ({ group }): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onClickGroup = (id) => {
    document.getElementById(`group-${id}`).scrollIntoView();
  };

  return (
    <div
      className="group-list-item"
      onClick={() => onClickGroup(group.id)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <i className={`group-icon ${group.icon}`} />
      <span className="group-list-title">{group.name}</span>
    </div>
  );
};

export default CollectionCard;
