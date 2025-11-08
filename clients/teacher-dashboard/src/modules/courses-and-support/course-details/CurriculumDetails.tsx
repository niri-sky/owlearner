import React, { useMemo, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaRegFolderOpen } from "react-icons/fa";
import {
  IoArrowBack,
  IoArrowForward,
  IoPlayCircleOutline,
} from "react-icons/io5";
import { RiTimer2Line } from "react-icons/ri";
import { IoIosArrowDown, IoMdAddCircleOutline } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";
import { motion } from "framer-motion";
import { Button, Modal, useDisclosure } from "@nextui-org/react";
import { AiOutlineDelete } from "react-icons/ai";
import { LuPlusSquare } from "react-icons/lu";
import AddNewSectionModal from "./AddNewSectionModal";
import AddNewContentModal from "./AddNewContentModal";

type Props = {
  data?: CourseData;
};

function CurriculumDetails({ data }: Props) {
  const { sectionsData, contents, totalSectionDuration } = useMemo(() => {
    const sectionsData = data?.section || [];

    const contents = sectionsData.flatMap((v) => v.content);

    const totalSectionDuration = sectionsData.reduce(
      (prev, current) =>
        prev + current.content.reduce((p, c) => p + (c.video_duration || 0), 0),
      0
    );

    return {
      sectionsData,
      contents,
      totalSectionDuration,
    };
  }, [data]);

  const { isOpen: sectionModal, onOpenChange: sectionModalChange } =
    useDisclosure();

  if (!data) return <></>;

  return (
    <>
      <div className="pt-[40px]"></div>
      <div>
        <div className="flex md:items-center gap-4 flex-col md:flex-row justify-between">
          <div className="text-[24px] font-playfair text-[#1D2026] leading-[32px] font-semibold">
            Curriculum
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-[6px]">
              <FaRegFolderOpen size={20} color="#C713CB" />
              <div className="text-sm leading-[22px] text-[#4E5566]">
                {sectionsData.length} Sections
              </div>
            </div>
            <div className="flex gap-[6px]">
              <IoPlayCircleOutline size={20} color="#564FFD" />
              <div className="text-sm leading-[22px] text-[#4E5566]">
                {contents.length} lectures
              </div>
            </div>
            <div className="flex gap-[6px]">
              <RiTimer2Line size={20} color="#FD8E1F" />
              <div className="text-sm leading-[22px] text-[#4E5566]">
                {toHoursMinutes(totalSectionDuration)}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-5"></div>

        <div className="border border-[#E9EAF0]">
          {sectionsData?.map((v, i) => (
            <CurriculumItem key={"gadf" + i} v={v} courseData={data} />
          ))}
        </div>
        <div className="pt-5"></div>
        <Button
          onClick={sectionModalChange}
          color="secondary"
          startContent={<LuPlusSquare />}
        >
          Add New Section
        </Button>
        <Modal
          size="5xl"
          scrollBehavior="outside"
          isOpen={sectionModal}
          onOpenChange={sectionModalChange}
        >
          <AddNewSectionModal courseId={Number(data.id)} />
        </Modal>
      </div>
    </>
  );
}

export function toHoursMinutes(milliseconds: number): string {
  const seconds: number = milliseconds / 1000;
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

type ItemProps = {
  v: Section;
  courseData: CourseData;
};

function CurriculumItem({ v, courseData }: ItemProps) {
  const [isWrap, setWrap] = useState(false);

  const { totalDuration } = useMemo(() => {
    const totalDuration = v.content.reduce(
      (p, c) => p + (c.video_duration || 0),
      0
    );

    return {
      totalDuration,
    };
  }, [v]);

  const { isOpen: contentModal, onOpenChange: contentModalChange } =
    useDisclosure();

  return (
    <div className="border-b border-[#E9EAF0]">
      <div
        onClick={() => setWrap(!isWrap)}
        className="flex p-[20px]  md:items-center gap-3 flex-col md:flex-row justify-between"
      >
        <div className="flex gap-2 items-center">
          <IoIosArrowDown />
          <div className="text-[16px] leading-[22px]">{v?.section_name}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-[6px]">
            <IoPlayCircleOutline size={20} color="#564FFD" />
            <div className="text-sm leading-[22px] text-[#4E5566]">
              {v?.content?.length} lectures
            </div>
          </div>
          <div className="flex gap-[6px]">
            <RiTimer2Line size={20} color="#FD8E1F" />
            <div className="text-sm leading-[22px] text-[#4E5566]">
              {toHoursMinutes(totalDuration)}
            </div>
          </div>
          {/* <Button isIconOnly size="sm" color="danger" variant="light">
            <AiOutlineDelete size={20} />
          </Button> */}
        </div>
      </div>
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: isWrap ? "auto" : 0 }}
      >
        <div className="px-[20px] pb-4 flex flex-col gap-[14px] ">
          {v?.content?.map((vv, i) => (
            <div key={"gsd" + i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IoIosPlay size={16} color="#1D2026" />
                <div className="text-[14px] leading-[22px] text-[#4E5566]">
                  {vv?.video_title}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[14px] leading-[22px] text-[#4E5566]">
                  {toMinutesSeconds(vv.video_duration || 0)}
                </div>
                {/* <Button isIconOnly size="sm" color="danger" variant="light">
                  <AiOutlineDelete size={20} />
                </Button> */}
              </div>
            </div>
          ))}
          <div>
            <Button
              onClick={contentModalChange}
              variant="light"
              color="primary"
              size="sm"
              startContent={<IoMdAddCircleOutline />}
            >
              Add More Content
            </Button>
          </div>
        </div>
      </motion.div>
      <Modal
        size="5xl"
        scrollBehavior="outside"
        isOpen={contentModal}
        onOpenChange={contentModalChange}
      >
        <AddNewContentModal
          courseId={Number(courseData.id)}
          sectionId={Number(v.id)}
        />
      </Modal>
    </div>
  );
}

export function toMinutesSeconds(milliseconds: number): string {
  const seconds: number = milliseconds / 1000;
  const minutes: number = Math.floor(seconds / 60);
  const remainingSeconds: number = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export default CurriculumDetails;
