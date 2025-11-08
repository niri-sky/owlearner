import { cn } from "@/shared/utils";
import React, { ReactNode, useRef, useState } from "react";
import { useOutsideClick } from "outsideclick-react";
import { motion } from "framer-motion";

import { MdEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { Control, ControllerRenderProps, useController } from "react-hook-form";
import ContentEditable from "react-contenteditable";
import { DraggableProvided } from "react-beautiful-dnd";

type Props = {
  name: string;
  children?: ReactNode;
  control: Control<any, any>;
  onSectionRemove: () => any;
  provided: DraggableProvided;
};

function SectionWrapper({
  control,
  name,
  children,
  onSectionRemove,
  provided,
}: Props) {
  const [isWrap, setWrap] = useState(true);

  const { field } = useController({ name, control });

  return (
    <div className="border-b border-[#ccc]">
      <div className="" key={name} {...provided?.dragHandleProps}>
        <div
          onClick={() => setWrap(!isWrap)}
          className="flex items-center py-2 cursor-pointer justify-between"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <ContentEditableInput {...field} />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Button
              onClick={onSectionRemove}
              isIconOnly
              color="danger"
              variant="light"
            >
              <AiOutlineDelete size={20} />
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: isWrap ? "auto" : 0 }}
      >
        <div className="  ">{children}</div>
      </motion.div>
    </div>
  );
}

export default SectionWrapper;

type EditableProps = {} & ControllerRenderProps<any, string>;

function ContentEditableInput({ value, onChange }: EditableProps) {
  const [isEditable, setEditable] = useState(false);

  const ref = useOutsideClick(() => {
    setEditable(false);
  });

  return (
    <div ref={ref} className="flex items-center gap-4">
      <ContentEditable
        className={cn(
          "focus:outline-none w-fit text-[20px]",
          isEditable && "border"
        )}
        html={value}
        onChange={onChange}
        disabled={!isEditable}
      />

      <div
        onClick={() => {
          setEditable(true);
        }}
        className="cursor-pointer"
      >
        <MdEdit size={20} />
      </div>
    </div>
  );
}
