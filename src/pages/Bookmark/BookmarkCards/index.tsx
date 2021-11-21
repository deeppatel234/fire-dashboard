import React, { useContext } from "react";

import {
  verticalListSortingStrategy,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";

import BookmarkContext from "../BookmarkContext";
import GroupCard from "./GroupCard";
import Sortable from "../../../components/DragAndDrop/Sortable";

const animateLayoutChanges = (args) =>
  args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true;

const BookmarkCards = (): JSX.Element => {
  const { data } = useContext(BookmarkContext);

  return (
    <div className="card-wrapper">
      <Sortable
        id="Groups"
        dataList={data.groupIds || []}
        strategy={verticalListSortingStrategy}
      >
        {data.groupIds?.map?.((id) => {
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
                animateLayoutChanges,
              }}
              component={GroupCard}
              customDrag
            />
          );
        })}
      </Sortable>
    </div>
  );
};

export default BookmarkCards;
