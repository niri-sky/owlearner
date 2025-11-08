import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@nextui-org/react";
import { useCouseAccessData } from "@/shared/context/CourseAccessProvider";

import {
  toHoursMinutes,
  toMinutesSeconds,
} from "../course-details/CurriculumDetails";

function RightBar() {
  const { data } = useCouseAccessData();

  return (
    <div className="">
      <div className="bg-[#fff] border divide-y-1 divide-[#E9EAF0] border-[#E9EAF0] shadow-[0px_6px_16px_0px_#0000000F]">
        {data?.section?.map((v, i) => (
          <SectionBar
            key={"gdsg" + i}
            item={v}
            sectionIndex={i}
            initWrap={i == 0 && true}
          />
        ))}
      </div>
    </div>
  );
}

type SectionProps = {
  item: Section;
  sectionIndex: number;
  initWrap?: boolean;
};

function SectionBar({ item, sectionIndex, initWrap }: SectionProps) {
  const [isWrap, setWrap] = useState(initWrap || false);
  const { activeContent, onContentSelect } = useCouseAccessData();

  const { totalSectionDuration } = useMemo(() => {
    const sectionsData = item;

    const contents = sectionsData.content;

    const totalSectionDuration = contents.reduce(
      (prev, c) => prev + (c?.video_duration || 0),
      0
    );

    return {
      totalSectionDuration,
    };
  }, [item]);
  return (
    <div className="">
      <div
        onClick={() => setWrap(!isWrap)}
        className="p-6  cursor-pointer flex items-center justify-between"
      >
        <div className="w-[calc(100%-30px)] ">
          <div className="font-dmsans text-[24px] leading-[32px] text-[#1D2026] font-normal">
            {item.section_name}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm leading-[20px] font-medium text-[#797979] font-dmsans">
              {item.content.length || 0} lesson
            </div>
            <div className="text-sm leading-[20px] font-medium text-[#797979] font-dmsans">
              {toHoursMinutes(totalSectionDuration)}
            </div>
          </div>
        </div>
        <div>
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5 9L12 16.5L4.5 9"
              stroke="#191C1F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="px-3">
        <motion.div
          className="overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: isWrap ? "auto" : 0 }}
        >
          <div className="flex  flex-col gap-6">
            {item?.content?.map((v, i) => (
              <div
                key={"test" + i}
                aria-selected={
                  activeContent.section === sectionIndex &&
                  activeContent.content == i
                }
                onClick={() => {
                  onContentSelect(i, sectionIndex);
                }}
                className={cn(
                  "p-[12px] flex gap-2 cursor-pointer group hover:bg-[#C713CB14] aria-selected:bg-primary"
                )}
              >
                <div className="pt-1">
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#0B72FF"
                    className="group-aria-selected:stroke-[#fff]"
                  >
                    <path
                      d="M12 15L16.5 20.25H7.5L12 15Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 18H4.5C4.10218 18 3.72064 17.842 3.43934 17.5607C3.15804 17.2794 3 16.8978 3 16.5V6C3 5.60218 3.15804 5.22064 3.43934 4.93934C3.72064 4.65804 4.10218 4.5 4.5 4.5H19.5C19.8978 4.5 20.2794 4.65804 20.5607 4.93934C20.842 5.22064 21 5.60218 21 6V16.5C21 16.8978 20.842 17.2794 20.5607 17.5607C20.2794 17.842 19.8978 18 19.5 18H18"
                      //   stroke="#0B72FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="w-[calc(100%-32px)]">
                  <div className="text-[24px] group-aria-selected:text-[#fff] font-dmsans leading-[32px] text-[#1E1E1E]">
                    {v.video_title}
                  </div>
                  <div className="pt-1"></div>
                  <div className="text-[#1E1E1E] group-aria-selected:text-[#fff] font-medium text-sm font-dmsans leading-[20px]">
                    {toMinutesSeconds(v.video_duration || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default RightBar;
