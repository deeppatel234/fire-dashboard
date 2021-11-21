import React from "react";

import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

const Sortable = ({ id, dataList, children, ...props }): JSX.Element => {
  return (
    <SortableContext
      id={id}
      items={dataList}
      strategy={rectSortingStrategy}
      {...props}
    >
      {children}
    </SortableContext>
  );
};

Sortable.Item = ({
  id,
  children,
  component: Component,
  data,
  as: As = "div",
  customDrag = false,
  componentProps,
  sortableProps,
  ...props
}): JSX.Element => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, ...sortableProps });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const childProps = {
    ...componentProps,
    id,
    data,
    dragProps: {
      ...attributes,
      ...listeners,
    },
  };

  return (
    <As
      {...props}
      ref={setNodeRef}
      style={style}
      {...(customDrag ? {} : { ...attributes, ...listeners })}
    >
      {Component ? <Component {...childProps} /> : children(childProps)}
    </As>
  );
};

export default Sortable;
