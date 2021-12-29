import React from "react";
import { useDroppable } from "@dnd-kit/core";

import "./index.scss";

const NewGroupDrop = () => {
  const { isOver, setNodeRef } = useDroppable({
    id: "NewGroupDroppable",
    data: {
      accepts: ["tab", "bookmark"],
    },
  });

  return (
    <div
      className={`new-group-drop ${isOver ? "highlight" : ""}`}
      ref={setNodeRef}
    >
      <div>Drop here to create collection.</div>
    </div>
  );
};

export default NewGroupDrop;
