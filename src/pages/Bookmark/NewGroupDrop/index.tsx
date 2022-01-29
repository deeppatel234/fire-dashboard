import React from "react";
import { useDroppable } from "@dnd-kit/core";
import classNames from "classnames";

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
      className={classNames("new-group-drop", {
        highlight: isOver,
      })}
      ref={setNodeRef}
    >
      <div>Drop here to create collection.</div>
    </div>
  );
};

export default NewGroupDrop;
