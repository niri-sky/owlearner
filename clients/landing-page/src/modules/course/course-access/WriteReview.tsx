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
import RatingStar from "../RatingStar";

const formSchema = yup.object({
  rating: yup.number().required(),
  text: yup.string().required(),
});

type FormType = yup.InferType<typeof formSchema>;

function WriteReview() {
  const { userData } = useUserData();

  const { data, updateStudentCourse } = useCouseAccessData();

  const { isReviewed, ratingData } = useMemo(() => {
    const ratingData = data?.reviews || [];
    const isReviewed = ratingData.find(
      (v) => v?.studentCourse?.student?.id == userData?.id
    );

    return { isReviewed, ratingData };
  }, [data, userData]);

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      rating: 5,
      text: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (v: FormType) => {
    if (loading) return;
    try {
      setLoading(true);
      await updateStudentCourse({
        review: {
          create: {
            ...v,
            course: {
              connect: { id: Number(data.id) },
            },
          },
        },
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pt-11"></div>
      {isReviewed ? (
        <div className="divide-y-1 divide-[#E9EAF0]">
          {ratingData?.map((v, i) => (
            <div key={"gsd" + i} className="flex gap-4 py-3">
              <div>
                <Image
                  alt="profile"
                  width={40}
                  height={40}
                  src={v?.studentCourse?.student?.profile || "/user-1.jpg"}
                  className="rounded-full"
                />
              </div>
              <div className="w-[calc(100%-56px)]">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-[#1D2026] leading-5 font-playfair font-medium">
                    {v?.studentCourse?.student?.name}
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
      ) : (
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
              <RatingInput
                value={watch("rating")}
                onChange={(r) => setValue("rating", r)}
              />
              <div className="pt-5"></div>
              <textarea
                id=""
                className={cn(
                  "min-h-[169px] w-full text-sm font-dmsans leading-[22px] text-[#4E5566] rounded-[12px] focus:outline-none border border-[#0000004D] p-[19px_30px]",
                  errors.text && "!border-red-500"
                )}
                placeholder="Write your question..."
                {...register("text")}
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
      )}
    </div>
  );
}

export default WriteReview;
