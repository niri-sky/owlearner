import React from "react";

// custom file imports
import TopicsElement from "../elements/topicsElement";
import { topicsData } from "@/app/configs/constants";
import Link from "next/link";
import { Button } from "@nextui-org/react";

const Topics = () => {
  return (
    <section className="xl:pb-[110px] xl:pt-[45px] lg:py-[60px] md:py-[40px] py-8 w-full bg-[#EBEEE4] lg:mt-[-110px] mt-[-205px]">
      <div className="container">
        <div className="flex items-center xl:flex-row flex-col justify-between xl:gap-[123px] lg:gap-0 gap-0">
          {/* left side */}
          <div className=" flex flex-col lg:gap-[24px] md:gap-5 gap-5">
            <div className="">
              <h2 className="xl:text-[48px] lg:text-[40px] md:text-[35px] text-[32px] text-title font-semibold xl:leading-[60px] lg:leading-[55px] md:leading-[50px] leading-[40px] font-playfair capitalize">
                Our most popular topics
              </h2>
            </div>
            <div className="lg:w-[82%] w-full">
              <p className="md:text-lg text-sm text-txt leading-[26px]">
                Search our most popular topics, gain new skills or advance in
                your expertise. Connect to peers in your course for more insight
                or advice.
              </p>
            </div>
            <div>
              <Button
                as={Link}
                href="/auth"
                className="py-4 px-8 !rounded-full text-white bg-primary"
              >
                Join now
              </Button>
            </div>
          </div>

          {/* right side */}
          <div className="w-full grid grid-cols-2 items-center md:gap-5 gap-[15px] lg:[&>*:nth-child(1)]:mt-[120px] [&>*:nth-child(1)]:mt-[50px] lg:[&>*:nth-child(4)]:-mt-[120px] [&>*:nth-child(4)]:-mt-[50px]">
            {topicsData.map(
              (
                { desc, title, topicIcon, backgroundColor }: topicDataTypes,
                i: number
              ) => (
                <TopicsElement
                  desc={desc}
                  title={title}
                  topicIcon={topicIcon}
                  backgroundColor={backgroundColor}
                  key={i}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Topics;
