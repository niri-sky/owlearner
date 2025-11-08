import React, { useEffect } from "react";
import { FormProps } from "./CourseInformationForm";
import { Button } from "@nextui-org/react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import SectionWrapper from "./SectionWrapper";
import { LuPlusSquare } from "react-icons/lu";
import { useFieldArray, useFormContext } from "react-hook-form";
import InputField from "../field/InputField";
import TextField from "../field/TextField";
import ContentInfoForm from "./ContentInfoForm";
import { Draggable, OnDragEndResponder } from "react-beautiful-dnd";
import DraggableProvider from "../DraggableProvider";
import { cn } from "@/shared/utils";

function CourseContentForm({ onChangeStatus }: FormProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { append, fields, remove, swap } = useFieldArray({
    name: "section",
    control,
  });

  console.log(fields, "fields");

  const handleOnDragEnd: OnDragEndResponder = async (result, provided) => {
    if (!result.destination) {
      return;
    }
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    swap(startIndex, endIndex);
  };

  return (
    <div>
      <DraggableProvider id="dropable-8325423" onDragEnd={handleOnDragEnd}>
        {fields.map((f, i) => (
          <Draggable
            index={i}
            key={"new_att_69576" + f.id}
            draggableId={"my_drag_2474" + f.id}
          >
            {(provided) => (
              <div
                key={"my_drag_2474" + i}
                ref={provided?.innerRef}
                {...provided?.draggableProps}
              >
                <SectionWrapper
                  key={f.id}
                  name={`section.${i}.section_name`}
                  control={control}
                  onSectionRemove={() => {
                    remove(i);
                  }}
                  provided={provided}
                >
                  <ContentInfoForm
                    control={control}
                    name={`section.${i}.content`}
                    register={register}
                  />
                </SectionWrapper>
              </div>
            )}
          </Draggable>
        ))}
      </DraggableProvider>
      <div className="pt-[30px]"></div>
      <div className="flex justify-center items-center">
        <Button
          onClick={() => {
            append({ section_name: "Untitled", content: [{}] });
          }}
          color="secondary"
          startContent={<LuPlusSquare />}
        >
          Add New Section
        </Button>
      </div>

      <div className="pt-[30px]"></div>

      <div className=""></div>
      <div className="flex items-center justify-between">
        <div>
          <Button
            color="primary"
            variant="light"
            startContent={<IoArrowBack />}
            type="submit"
            onClick={() => onChangeStatus("options")}
          >
            <span className="hidden sm:block">Prev</span>
          </Button>
        </div>
        <div>
          <Button
            // onClick={() => onChangeStatus("preview")}
            type="submit"
            color="primary"
            endContent={<IoArrowForward />}
          >
            <span className="hidden sm:block">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CourseContentForm;
