import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const BookmarkCard = ({ bookmark }): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onClickCard = () => {
    window.open(bookmark.url, "_self");
  };

  return (
    <div
      className="bookmark-card"
      onClick={onClickCard}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {bookmark.favIconUrl ? (
        <img className="fav-img" src={bookmark.favIconUrl} />
      ) : (
        <i className="ri-window-line fav-img fav-img-icon" />
      )}
      <span className="bookmark-title">{bookmark.title}</span>
    </div>
  );
};

export default BookmarkCard;
