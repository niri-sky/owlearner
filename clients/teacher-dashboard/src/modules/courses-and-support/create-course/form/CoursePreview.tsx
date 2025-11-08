import React, { useEffect, useMemo, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaRegFolderOpen } from "react-icons/fa";
import {
  IoArrowBack,
  IoArrowForward,
  IoPlayCircleOutline,
} from "react-icons/io5";
import { RiTimer2Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";
import { motion } from "framer-motion";
import { RiBarChartLine } from "react-icons/ri";
import { PiNotebook } from "react-icons/pi";
import { PiNotepad } from "react-icons/pi";
import { FormProps } from "./CourseInformationForm";
import { Button } from "@nextui-org/react";
import { isBrowser } from "../field/NewSectionFileField";
import { isVideoFile, loadVideo } from "@/shared/hooks/use-upload-files";

type Props = {
  data: any;
} & FormProps;

function CoursePreview({ data, onChangeStatus }: Props) {
  console.log(data);

  const imgSrc = useMemo(() => {
    return typeof data?.thumbnail === "string"
      ? data?.thumbnail
      : isBrowser
      ? data?.thumbnail instanceof File
        ? URL.createObjectURL(data?.thumbnail)
        : ""
      : "";
  }, [data?.thumbnail]);

  const [d, setD] = useState<any>({});

  console.log(d, "Database");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsData: any[] = await getVideoDetails(data?.section || []);
        const extractedContents = sectionsData.flatMap((v) => v.content);
        const duration = sectionsData.reduce(
          (prev, current) =>
            prev +
            current.content?.reduce(
              (p: any, c: any) => p + (c.video_duration || 0),
              0
            ),
          0
        );

        setD({ sectionsData, extractedContents, duration });
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, [data]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-[25px]">
        <div className="left section lg:w-[calc(100%-375px)]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              className="w-full max-h-[500px] object-cover"
              alt=""
            />
          </div>
          <div className="pt-[40px]"></div>
          <div className="text-[32px] font-semibold leading-[40px]">
            {data?.title}
          </div>
          <div className="pt-[40px]"></div>

          <div>
            <div className="text-[24px] leading-[32px] font-semibold">
              Description
            </div>
            <div className="pt-5"></div>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: data?.description }}
            ></div>
          </div>

          <div className="pt-[40px]"></div>
          <div className="bg-[#E1F7E366] p-[40px]">
            <div className="text-[24px] font-semibold leading-[32px]">
              What you will learn in this course
            </div>
            <div className="pt-5"></div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-[24px] gap-y-5">
              {data?.what_you_will_learn?.map((v: any, i: number) => (
                <div key={"gsad" + i} className="flex gap-2">
                  <div>
                    <FaCircleCheck color="#23BD33" size={24} />
                  </div>
                  <div className="text-sm w-[calc(100%-32px)] leading-[22px]">
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-[40px]"></div>

          <div>
            <div className="text-[24px] leading-[32px] font-semibold">
              Course requirements
            </div>
            <div className="pt-5"></div>
            <ul className="flex list-disc gap-3 flex-col">
              {data?.course_requirements?.map((v: any, i: number) => (
                <li key={"ghd" + i} className="text-sm ml-4 leading-[22px]">
                  {v}
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-[40px]"></div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-[24px] text-[#1D2026] leading-[32px] font-semibold">
                Curriculum
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-[6px]">
                  <FaRegFolderOpen size={20} color="#C713CB" />
                  <div className="text-sm leading-[22px] text-[#4E5566]">
                    {data?.section?.length || 0} Sections
                  </div>
                </div>
                <div className="flex gap-[6px]">
                  <IoPlayCircleOutline size={20} color="#564FFD" />
                  <div className="text-sm leading-[22px] text-[#4E5566]">
                    {d?.extractedContents?.length || 0} lectures
                  </div>
                </div>
                <div className="flex gap-[6px]">
                  <RiTimer2Line size={20} color="#FD8E1F" />
                  <div className="text-sm leading-[22px] text-[#4E5566]">
                    {toHoursMinutes(d?.duration || 0)}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-5"></div>
            <div className="border border-[#E9EAF0]">
              {d?.sectionsData?.map((v: any, i: number) => (
                <CurriculumItem key={"gadf" + i} v={v} />
              ))}
            </div>
          </div>
        </div>
        <div className="right-section lg:w-[350px]">
          <div className="border border-[#E9EAF0]">
            <div className=" ">
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="text-[24px] leading-[32px] text-[#1D2026]">
                    {data?.price}
                  </div>
                  {data?.estimated_price && (
                    <div className="text-base text-[#8C94A3] line-through">
                      {data?.estimated_price}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-[1px] w-full block bg-[#E9EAF0]"></div>
            <div className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiTimer2Line size={24} color="#A1A5B3" />
                    <div className="text-[14px] leading-[22px] text-[#1D2026]">
                      Course Duration
                    </div>
                  </div>
                  <div className="text-[14px] leading-[22px] text-[#6E7485] ">
                    {data?.duration}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiBarChartLine size={24} color="#A1A5B3" />
                    <div className="text-[14px] leading-[22px] text-[#1D2026]">
                      Course Level
                    </div>
                  </div>
                  <div className="text-[14px] leading-[22px] text-[#6E7485] ">
                    {data?.level}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PiNotebook size={24} color="#A1A5B3" />
                    <div className="text-[14px] leading-[22px] text-[#1D2026]">
                      Language
                    </div>
                  </div>
                  <div className="text-[14px] leading-[22px] text-[#6E7485] ">
                    {data?.language}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PiNotepad size={24} color="#A1A5B3" />
                    <div className="text-[14px] leading-[22px] text-[#1D2026]">
                      Subtittle Language
                    </div>
                  </div>
                  <div className="text-[14px] leading-[22px] text-[#6E7485] ">
                    {data?.subtitle_language}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-[30px]"></div>
      <div className="flex items-center justify-between">
        <div>
          <Button
            color="primary"
            variant="light"
            startContent={<IoArrowBack />}
            onClick={() => onChangeStatus("content")}
          >
            <span className="hidden sm:block">Prev</span>
          </Button>
        </div>
        <div>
          <Button color="primary" type="submit" endContent={<IoArrowForward />}>
            <span className="hidden sm:block">Create</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function toHoursMinutes(milliseconds: number): string {
  const seconds: number = milliseconds / 1000;
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

async function getVideoDetails(obj: any) {
  let object: any = obj || {};
  for (let [key, value] of Object.entries(object)) {
    if (typeof value === "object") {
      object[key] = await getVideoDetails(value);
    }

    if (value instanceof File) {
      const fileObj: File = value;
      object[key] = fileObj;
      if (isVideoFile(fileObj) && "video_title" in object) {
        const video = await loadVideo(fileObj);
        object["video_duration"] = video.duration
          ? Number(Math.round(video.duration * 1000).toFixed(0))
          : 100000;
      }
    }
  }
  return object;
}

export default CoursePreview;

function CurriculumItem({ v }: any) {
  const [isWrap, setWrap] = useState(false);

  const { totalDuration } = useMemo(() => {
    const totalDuration = v.content.reduce(
      (p: any, c: any) => p + (c.video_duration || 0),
      0
    );

    return {
      totalDuration,
    };
  }, [v]);

  return (
    <div className="border-b border-[#E9EAF0]">
      <div
        onClick={() => setWrap(!isWrap)}
        className="flex p-[20px] items-center justify-between"
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
        </div>
      </div>
      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: isWrap ? "auto" : 0 }}
      >
        <div className="px-[20px] pb-4 flex flex-col gap-[14px] ">
          {v?.content?.map((vv: any, i: number) => (
            <div key={"gsd" + i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IoIosPlay size={16} color="#1D2026" />
                <div className="text-[14px] leading-[22px] text-[#4E5566]">
                  {vv?.video_title}
                </div>
              </div>
              <div className="text-[14px] leading-[22px] text-[#4E5566]">
                {toMinutesSeconds(vv?.video_duration || 0)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function toMinutesSeconds(milliseconds: number): string {
  const seconds: number = milliseconds / 1000;
  const minutes: number = Math.floor(seconds / 60);
  const remainingSeconds: number = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}
