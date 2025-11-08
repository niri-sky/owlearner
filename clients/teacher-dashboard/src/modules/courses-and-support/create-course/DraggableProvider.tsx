import React, { ReactNode } from "react";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";

type DPType = {
  onDragEnd: OnDragEndResponder;
  id?: string;
  className?: string;
  children: ReactNode;
};

function DraggableProvider({ onDragEnd, id, className, children }: DPType) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={id || "droppable_243212"}>
        {(dProvided) => (
          <div
            {...dProvided.droppableProps}
            className={className}
            ref={dProvided.innerRef}
          >
            {children}
            {dProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableProvider;
