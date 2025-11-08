import React, { useMemo, useState } from "react";
import Image from "next/image";
import RatingInput from "./RatingInput";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spinner, cn } from "@nextui-org/react";
import useUserData from "@/shared/hooks/useUserData";
import { useCouseAccessData } from "@/shared/context/CourseAccessProvider";
import Moment from "react-moment";

const formSchema = yup.object({
  question: yup.string().required(),
});

type FormType = yup.InferType<typeof formSchema>;

function QuestionAndAnswer() {
  const { userData } = useUserData();

  const { activeContentData, updateStudentCourse } = useCouseAccessData();

  const { questionData } = useMemo(() => {
    const questionData = activeContentData.questions || [];
    return { questionData };
  }, [activeContentData]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (v: FormType) => {
    if (loading) return;
    try {
      setLoading(true);
      await updateStudentCourse({
        questions: {
          create: {
            ...v,
            courseContent: {
              connect: { id: Number(activeContentData?.id) },
            },
          },
        },
      });

      reset();

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pt-11"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-[10px]">
          <div>
            <Image
              height={60}
              width={60}
              src={userData?.profile || "/user-1.jpg"}
              alt="test"
              className="rounded-full"
            />
          </div>
          <div className="w-[calc(100%-70px)] ">
            <textarea
              id=""
              className={cn(
                "min-h-[129px] w-full text-sm font-dmsans leading-[22px] text-[#4E5566] rounded-[12px] focus:outline-none border border-[#0000004D] p-[19px_30px]",
                errors.question && "!border-red-500"
              )}
              placeholder="Write your question..."
              {...register("question")}
            ></textarea>
          </div>
        </div>
        <div className="pt-6"></div>
        <div className="flex justify-end">
          <button
            disabled={loading}
            type="submit"
            className="h-[58px] font-lg font-bold font-dmsans min-w-[159px] flex items-center justify-center disabled:opacity-80 gap-2 text-[#fff] bg-primary rounded-full "
          >
            {loading ? (
              <>
                <Spinner size="sm" color="default" /> Loading...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
      <div className="pt-11"></div>
      <div className="flex flex-col gap-8">
        {questionData?.map((v, i) => (
          <QuesAndAnsItem key={"gdd" + i} data={v} />
        ))}
      </div>
    </>
  );
}

type ItemProps = {
  data: CourseQuestion;
};

function QuesAndAnsItem({ data }: ItemProps) {
  const { data: courseData } = useCouseAccessData();
  const [isReply, setReply] = useState(false);

  return (
    <div>
      <div className="flex gap-[24px]">
        <div>
          <Image
            height={60}
            width={60}
            src={data?.studentCourse?.student?.profile || "/user-1.jpg"}
            alt="test"
            className="rounded-full object-cover"
          />
        </div>
        <div className="w-[calc(100%-84px)] ">
          <div>
            <div className="text-[24px] font-semibold font-dmsans leading-[32px] text-[#1D2026]">
              {data?.studentCourse?.student?.name}
            </div>
            <div className="pt-1"></div>
            <div className="font-dmsans text-base leading-[24px] text-[#666666] ">
              {data?.question}
            </div>
            <div className="pt-2"></div>
            <div className="text-sm text-[#605F5F] leading-[20px] font-semibold font-dmsans">
              <Moment date={data?.createdAt} fromNow />
            </div>
            <div className="pt-3"></div>
            <div>
              {data.answer &&
                (!isReply ? (
                  <div>
                    <button
                      onClick={() => setReply(true)}
                      className="flex font-dmsans gap-[6px] items-center text-base leading-[24px] font-medium text-[#666666] "
                    >
                      View Reply
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.25625 18.9281L4.22812 21.4594C4.11886 21.5498 3.9862 21.6074 3.84553 21.6254C3.70486 21.6435 3.56195 21.6213 3.43338 21.5615C3.30481 21.5016 3.19585 21.4065 3.11914 21.2872C3.04244 21.1679 3.00112 21.0293 3 20.8875V6C3 5.80109 3.07902 5.61032 3.21967 5.46967C3.36032 5.32902 3.55109 5.25 3.75 5.25H20.25C20.4489 5.25 20.6397 5.32902 20.7803 5.46967C20.921 5.61032 21 5.80109 21 6V18C21 18.1989 20.921 18.3897 20.7803 18.5303C20.6397 18.671 20.4489 18.75 20.25 18.75H7.73438C7.55878 18.75 7.38907 18.8133 7.25625 18.9281V18.9281Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="pt-10">
                    <div className="flex gap-[24px]">
                      <div>
                        <Image
                          height={40}
                          width={40}
                          src={courseData?.teacher?.profile || "/user-1.jpg"}
                          alt="test"
                          className="rounded-full"
                        />
                      </div>
                      <div className="w-[calc(100%-84px)] ">
                        <div>
                          <div className="text-[18px] font-semibold font-dmsans leading-[32px] text-[#1D2026]">
                            {courseData?.teacher?.name}
                          </div>
                          <div className="pt-1"></div>
                          <div className="font-dmsans text-base leading-[24px] text-[#666666] ">
                            {data?.answer}
                          </div>
                          <div className="pt-2"></div>
                          <div className="text-sm text-[#605F5F] leading-[20px] font-semibold font-dmsans">
                            <Moment date={data?.updatedAt} fromNow />
                          </div>
                          <div className="pt-3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* {isReply && (
            <div>
              <div className="flex gap-[10px]">
                <div className="w-full ">
                  <textarea
                    name=""
                    id=""
                    className="min-h-[80px] w-full text-sm font-dmsans leading-[22px] text-[#4E5566] rounded-[12px] focus:outline-none border border-[#0000004D] p-[19px_30px]"
                    placeholder="Write your reply..."
                  ></textarea>
                </div>
              </div>
              <div className="pt-4"></div>
              <div className="flex justify-end gap-6">
                <button
                  onClick={() => setReply(false)}
                  className="h-[40px] font-lg font-bold font-dmsans min-w-[159px] text-primary border-primary border rounded-full "
                >
                  Cancel
                </button>
                <button className="h-[40px] font-lg font-bold font-dmsans min-w-[159px] text-[#fff] bg-primary rounded-full ">
                  Reply
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default QuestionAndAnswer;
