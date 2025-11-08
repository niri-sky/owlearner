import React from "react";
import {
  UseFieldArrayProps,
  useController,
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import { Control, UseFormRegister } from "react-hook-form";
import InputField from "../field/InputField";
import TextField from "../field/TextField";
import { Button } from "@nextui-org/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import SingleContentForm from "./SingleContentForm";
import DraggableProvider from "../DraggableProvider";
import { Draggable, OnDragEndResponder } from "react-beautiful-dnd";
import { cn } from "@/shared/utils";

type Props = {
  register: UseFormRegister<any>;
  control: Control<any, any>;
  name: string;
};

function ContentInfoForm({ control, register, name }: Props) {
  const { errors } = useFormState({ control });

  const { fields, append, remove, swap } = useFieldArray({ control, name });

  const handleOnDragEnd: OnDragEndResponder = async (result, provided) => {
    if (!result.destination) {
      return;
    }
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    swap(startIndex, endIndex);
  };

  return (
    <div className="">
      <div className="flex flex-col gap-5">
        <DraggableProvider id="dropable-32312415" onDragEnd={handleOnDragEnd}>
          {fields.map((f, i) => (
            <Draggable
              index={i}
              key={"new_att_62454" + f.id}
              draggableId={"my_drag_233" + f.id}
            >
              {(provided) => (
                <div
                  key={"my_drag_233" + i}
                  ref={provided?.innerRef}
                  {...provided?.draggableProps}
                  {...provided?.dragHandleProps}
                  className={cn("pb-5")}
                >
                  <SingleContentForm
                    name={`${name}.${i}`}
                    index={i}
                    onRemove={() => remove(i)}
                  />
                </div>
              )}
            </Draggable>
          ))}
        </DraggableProvider>
      </div>

      <div className="mb-4">
        <Button
          onClick={() => {
            append({ links: [{}] });
          }}
          variant="light"
          color="primary"
          startContent={<IoMdAddCircleOutline />}
        >
          Add More Content
        </Button>
      </div>
    </div>
  );
}

export default ContentInfoForm;
