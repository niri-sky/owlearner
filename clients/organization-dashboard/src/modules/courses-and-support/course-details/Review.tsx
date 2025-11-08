import React, { useMemo, useState } from "react";
import RatingStar from "./RatingStar";
import Image from "next/image";
import { Select, SelectItem } from "@nextui-org/react";
import Moment from "react-moment";
import { RatingData } from "./CoursePreview";

type Props = {
  data?: CourseData;
  totalRating: number;
  ratingData: RatingData;
};

function Review({ data, totalRating, ratingData }: Props) {
  const [filter, setFilter] = useState<string>();

  const filterRatings = useMemo(() => {
    let ratings = data?.reviews || [];

    ratings = filter
      ? ratings.filter((v) => v.rating == Number(filter))
      : ratings;

    return ratings;
  }, [filter, data]);

  return (
    <>
      <div className="pt-[40px]"></div>
      <div>
        <div className="text-[24px] font-playfair text-[#1D2026] leading-[32px] font-semibold">
          Course Rating
        </div>
        <div className="pt-5"></div>
        <div className="flex lg:flex-row flex-col gap-6">
          <div className="h-[190px] lg:w-[200px] border border-[#E9EAF0] flex flex-col items-center justify-center">
            <div className="text-[48px] leading-[52px] font-bold text-center text-[#1D2026] font-dmsans">
              {(totalRating || 0).toFixed(1)}
            </div>
            <div className="pt-[24px]"></div>
            <RatingStar rating={totalRating || 0} width={20} height={20} />
            <div className="pt-[12px]"></div>
            <div className="text-[14px] leading-[20px] text-[#1D2026] font-dmsans">
              Course Rating
            </div>
          </div>
          <div className="lg:w-[calc(100%-214px)] flex flex-col gap-5">
            <RatingReuseableComp
              percent={ratingData["5"].percent}
              rating={ratingData["5"].rating}
            />
            <RatingReuseableComp
              percent={ratingData["4"].percent}
              rating={ratingData["4"].rating}
            />
            <RatingReuseableComp
              percent={ratingData["3"].percent}
              rating={ratingData["3"].rating}
            />
            <RatingReuseableComp
              percent={ratingData["2"].percent}
              rating={ratingData["2"].rating}
            />
            <RatingReuseableComp
              percent={ratingData["1"].percent}
              rating={ratingData["1"].rating}
            />
          </div>
        </div>
      </div>{" "}
      <div className="pt-[40px]"></div>
      <div>
        <div className="flex items-center justify-between">
          <div className="text-[24px] py-2 font-playfair text-[#1D2026] leading-[32px] font-semibold">
            Students Feedback
          </div>
          <div className="w-[200px]">
            <Select
              items={[
                { label: "5 Star Rating", value: "5" },
                { label: "4 Star Rating", value: "4" },
                { label: "3 Star Rating", value: "3" },
                { label: "2 Star Rating", value: "2" },
                { label: "1 Star Rating", value: "1" },
              ]}
              label={"select item"}
              size="sm"
              selectedKeys={filter ? [filter] : []}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              classNames={{
                trigger: "bg-[#F8F8F8] border border-[#E5DDED]",
              }}
            >
              {(val) => (
                <SelectItem key={val.value} value={val.value}>
                  {val.label}
                </SelectItem>
              )}
            </Select>
          </div>
        </div>
        <div className="divide-y-1 divide-[#E9EAF0]">
          {filterRatings?.map((v, i) => (
            <div key={"gsd" + i} className="flex gap-4 py-5">
              <div>
                <Image
                  alt="profile"
                  width={40}
                  height={40}
                  src={v.studentCourse?.student?.profile || "/user-1.jpg"}
                  className="rounded-full"
                />
              </div>
              <div className="w-[calc(100%-56px)]">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-[#1D2026] leading-5 font-playfair font-medium">
                    {v.studentCourse.student?.name}
                  </div>
                  <div>•</div>
                  <div className="text-xs leading-4 font-dmsans text-[#6E7485]">
                    <Moment date={v.createdAt} fromNow />
                  </div>
                </div>
                <div className="pt-2"></div>
                <div>
                  <RatingStar rating={v.rating} />
                </div>
                <div className="pt-3"></div>

                <div className="text-sm leading-[22px] text-[#4E5566] font-dmsans">
                  {v.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

type RatingCompProps = {
  rating: number;
  percent: number;
};

function RatingReuseableComp({ percent, rating }: RatingCompProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex gap-[6px] items-center">
        <RatingStar width={20} height={20} rating={rating} />
        <div className="text-[14px] text-nowrap leading-[22px] font-dmsans text-[#6E7485] ">
          {rating} Star Rating
        </div>
      </div>
      <div className="relative w-[calc(100%-270px)] h-[8px] bg-[#FFF2E5]">
        <div
          style={{
            width: `${percent}%`,
          }}
          className="absolute top-0 left-0 h-full bg-[#FD8E1F]"
        ></div>
      </div>

      <div className="text-sm font-dmsans font-medium leading-[20px] text-[#1D2026]">
        {percent}%
      </div>
    </div>
  );
}

export default Review;
