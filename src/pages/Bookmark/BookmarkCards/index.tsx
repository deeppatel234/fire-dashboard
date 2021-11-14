import React, { useContext, useMemo } from "react";

import { verticalListSortingStrategy } from "@dnd-kit/sortable";

import BookmarkContext from "../BookmarkContext";
import GroupCard from "./GroupCard";
import Sortable from "../../../components/DragAndDrop/Sortable";

const BookmarkCards = (): JSX.Element => {
  const { sortedGroupList } = useContext(BookmarkContext);

  const preparedDataList = useMemo(() => {
    return sortedGroupList.map((group) => `CollectionCards-${group.id}`);
  }, [sortedGroupList]);

  return (
    <div className="card-wrapper">
      <Sortable
        id="CollectionCards"
        dataList={preparedDataList}
        strategy={verticalListSortingStrategy}
      >
        {sortedGroupList.map((groupData) => {
          const id = `CollectionCards-${groupData.id}`;

          return (
            <Sortable.Item
              key={id}
              id={id}
              data={groupData}
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
