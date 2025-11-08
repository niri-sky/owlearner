import { FaCircleCheck } from "react-icons/fa6";

type Props = {
  data?: any;
};

function CourseOverview({ data }: Props) {
  return (
    <>
      <div className="pt-[40px]"></div>
      <div>
        <div className="text-[24px] font-playfair leading-[32px] font-semibold">
          Description
        </div>
        <div className="pt-5"></div>
        <div
          className="unreset "
          dangerouslySetInnerHTML={{ __html: data?.description }}
        ></div>
      </div>
      <div className="pt-[40px]"></div>
      <div className="bg-[#E1F7E366] p-[40px]">
        <div className="text-[24px] font-playfair font-semibold leading-[32px]">
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
        <div className="text-[24px] font-playfair leading-[32px] font-semibold">
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
    </>
  );
}

export default CourseOverview;
