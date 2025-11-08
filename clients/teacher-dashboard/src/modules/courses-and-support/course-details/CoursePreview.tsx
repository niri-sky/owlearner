import React, { useMemo, useState } from "react";
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
import { Button, Select, SelectItem } from "@nextui-org/react";
import RightDetails from "./RightDetails";
import TabWrapper from "./TabWrapper";
import RatingStar from "./RatingStar";
import Image from "next/image";
import Enrolled from "./icons/Enrolled";
import CourseOverview from "./CourseOverview";
import CurriculumDetails from "./CurriculumDetails";
import InstructorDetails from "./InstructorDetails";
import Review from "./Review";

type Props = {
  data?: CourseData;
};

export type RatingData = {
  [k: string]: {
    count: number;
    total: number;
    rating: number;
    percent: number;
  };
};

function CoursePreview({ data }: Props) {
  const { totalRating, ratingData } = useMemo(() => {
    const reviews = data?.reviews || [];
    let totalReview = 0;
    let reviewCount = 0;

    let ratingData: RatingData = {
      "1": {
        count: 0,
        total: 0,
        rating: 0,
        percent: 0,
      },
      "2": {
        count: 0,
        total: 0,
        rating: 0,
        percent: 0,
      },
      "3": {
        count: 0,
        total: 0,
        rating: 0,
        percent: 0,
      },
      "4": {
        count: 0,
        total: 0,
        rating: 0,
        percent: 0,
      },
      "5": {
        count: 0,
        total: 0,
        rating: 0,
        percent: 0,
      },
    };

    for (const r of reviews) {
      totalReview += r.rating;
      reviewCount++;
      ratingData[r.rating.toString()].count++;
      ratingData[r.rating.toString()].total += r.rating;
    }

    for (const [key, value] of Object.entries(ratingData)) {
      let { count, total } = value;
      ratingData[key].rating = total / count || 0;
      ratingData[key].percent = ((5 * count) / total) * 100 || 0;
    }

    return {
      totalRating: totalReview / reviewCount,
      ratingData,
    };
  }, [data]);

  console.log("Rating Data", ratingData);

  return (
    <div>
      <div className="flex flex-col-reverse lg:flex-row gap-[24px]">
        <div className="left  section lg:w-[calc(100%-448px)]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data?.thumbnail || "/course-image.png"}
              className="w-full max-h-[500px] object-cover"
              alt=""
            />
          </div>
          <div className="pt-[40px]"></div>
          <div className="text-[32px] font-playfair font-semibold leading-[40px]">
            {data?.title}
          </div>
          <div className="pt-[24px]"></div>
          <div className="flex md:items-center gap-5 flex-col md:flex-row justify-between">
            <div className="flex gap-3">
              <div className="flex items-center">
                <div className="border-2 rounded-full border-[#fff]">
                  <Image
                    src={data?.teacher?.profile || "/user-1.jpg"}
                    width={50}
                    height={50}
                    alt="avatar"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="text-sm leading-[22px] font-dmsans">
                  Created by:
                </div>
                <div className="pt-1"></div>
                <div className="flex items-center gap-[6px]">
                  <div className="text-base leading-[22px] font-medium font-dmsans text-[#1D2026]">
                    {data?.teacher?.name}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RatingStar rating={totalRating || 0} />
              <div className="text-base leading-[22px] text-[#6E7485]  font-dmsans">
                <span className="text-[#1D2026] font-medium">
                  {(totalRating || 0).toFixed(1)}
                </span>{" "}
                ({data?.reviews?.length || 0} Rating)
              </div>
            </div>
          </div>
          <div className="pt-[20px]"></div>
          <TabWrapper
            tabs={["Overview", "Curriculum", "Instructor", "Reviews"]}
          >
            {() => ({
              Overview: (
                <>
                  <CourseOverview data={data} />
                  <CurriculumDetails data={data} />
                  <InstructorDetails data={data} />
                  <Review
                    data={data}
                    totalRating={totalRating}
                    ratingData={ratingData}
                  />
                </>
              ),
              Curriculum: (
                <>
                  <CurriculumDetails data={data} />
                </>
              ),
              Instructor: (
                <>
                  <InstructorDetails data={data} />
                </>
              ),
              Review: (
                <>
                  <Review
                    data={data}
                    totalRating={totalRating}
                    ratingData={ratingData}
                  />
                </>
              ),
            })}
          </TabWrapper>
        </div>
        <RightDetails data={data} />
      </div>
    </div>
  );
}

export default CoursePreview;
