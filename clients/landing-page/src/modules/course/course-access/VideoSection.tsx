"use client";
import React, { useMemo, useState } from "react";
import TabWrapper from "../course-details/TabWrapper";
import QuizBar from "./QuizBar";
import CourseDescription from "./CourseDescription";
import QuestionAndAnswer from "./QuestionAndAnswer";
import WriteReview from "./WriteReview";
import { useCouseAccessData } from "@/shared/context/CourseAccessProvider";
import _ from "lodash";

import MuxPlayer from "@mux/mux-player-react";
import ResoursesSection from "./ResoursesSection";
import { MdCheck } from "react-icons/md";
import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function VideoSection() {
  const {
    activeContentData,
    activeContent,
    data,
    onContentSelect,
    updateStudentCourse,
  } = useCouseAccessData();

  const { isNextEnd, isPrevEnd } = useMemo(() => {
    const lastIndex = data?.section?.length - 1;
    const lastContentIndex = data.section[lastIndex].content.length - 1;
    const isNextEnd =
      activeContent.section == lastIndex &&
      activeContent.content == lastContentIndex;
    const isPrevEnd = activeContent.content == 0 && activeContent.section == 0;

    return { isNextEnd, isPrevEnd };
  }, [activeContent, data]);

  const onNextContent = () => {
    const currentSection = _.get(data, `section[${activeContent.section}]`);

    const totalContentIndex = currentSection.content.length - 1;

    if (totalContentIndex > activeContent.content) {
      onContentSelect(activeContent.content + 1);
    } else {
      onContentSelect(0, activeContent.section + 1);
    }
  };

  const onPrevContent = () => {
    if (activeContent.content === 0) {
      const prevSectionIndex = activeContent.section - 1;
      const prevSection = _.get(data, `section[${prevSectionIndex}]`);
      const contentIndex = prevSection.content.length - 1;
      console.log("pRev", prevSection, contentIndex, prevSectionIndex);

      onContentSelect(contentIndex, prevSectionIndex);
    } else {
      onContentSelect(activeContent.content - 1);
    }
  };

  const [completeLoading, setCompleteLoading] = useState(false);
  const router = useRouter();

  const onCourseCompleted = async () => {
    if (completeLoading) return;
    try {
      setCompleteLoading(true);
      await updateStudentCourse({
        status: "completed",
        completedAt: new Date().toISOString(),
      });
      // setCompleteLoading(false);
      router.push("/dashboard");
      toast.success("Status completed");
    } catch (error) {
      setCompleteLoading(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <div>
        <div>
          <MuxPlayer
            playbackId={activeContentData.file}
            metadata={{
              video_id: activeContentData.id,
              video_title: activeContentData.video_title,
            }}
          />
        </div>
        <div className="pt-6"></div>
        <div className="flex items-center justify-between">
          <button
            disabled={isPrevEnd}
            onClick={onPrevContent}
            className={
              "h-[36px] md:h-[48px] flex items-center gap-2 md:gap-3 text-sm md:text-base font-dmsans  text-[#fff] bg-primary px-3 md:px-5 rounded-full disabled:opacity-50"
            }
          >
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className=" max-md:w-4 max-md:h-4"
            >
              <path
                d="M20.25 12H3.75"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 5.25L3.75 12L10.5 18.75"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous Lesson
          </button>
          {isNextEnd ? (
            <button
              onClick={onCourseCompleted}
              disabled={completeLoading}
              className="h-[36px] md:h-[48px] flex items-center gap-2 md:gap-3 text-sm md:text-base font-dmsans  text-[#fff] bg-primary px-3 md:px-5 rounded-full disabled:opacity-50"
            >
              {completeLoading ? (
                <>
                  <Spinner color="white" />
                  Loading...
                </>
              ) : (
                <>
                  Completed
                  <MdCheck size={24} />
                </>
              )}
            </button>
          ) : (
            <button
              disabled={isNextEnd}
              onClick={onNextContent}
              className="h-[36px] md:h-[48px] flex items-center gap-2 md:gap-3 text-sm md:text-base font-dmsans  text-[#fff] bg-primary px-3 md:px-5 rounded-full disabled:opacity-50"
            >
              Next Lesson
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180 max-md:w-4 max-md:h-4"
              >
                <path
                  d="M20.25 12H3.75"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 5.25L3.75 12L10.5 18.75"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="pt-6"></div>
        <div>
          <div className="text-[20px] leading-[28px] md:text-[32px] md:leading-[40px] font-semibold font-playfair">
            {activeContentData.contentNumber}. {activeContentData.video_title}
          </div>
        </div>
        <div className="pt-6"></div>
        <div>
          <TabWrapper
            className="max-md:!grid-cols-3"
            tabs={["Overview", "Resources", "Q&A", "Quizzes", "Reviews"]}
          >
            {() => ({
              Overview: (
                <>
                  <CourseDescription />
                  <QuestionAndAnswer />
                </>
              ),
              Quizzes: (
                <>
                  <QuizBar />
                </>
              ),
              "Q&A": (
                <>
                  <QuestionAndAnswer />
                </>
              ),
              Resources: (
                <>
                  <ResoursesSection />
                </>
              ),
              Reviews: (
                <>
                  <WriteReview />
                </>
              ),
            })}
          </TabWrapper>
        </div>
      </div>
    </div>
  );
}

export default VideoSection;
