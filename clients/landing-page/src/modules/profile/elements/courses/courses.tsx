"use client";
import Image from "next/image";
import Link from "next/link";
// custom file import

type Props = {
  data?: CourseData;
};

const Courses = ({ data }: Props) => {
  return (
    <div className="flex flex-col shadow-sm hover:shadow-md border border-bcolor rounded-[12px] pb-3">
      <div className="w-full">
        <div className="w-full sm:h-[160px] h-full">
          <Image
            className=" w-full h-full object-cover"
            width={250}
            height={160}
            src={data?.thumbnail || "/images/course-images-1.png"}
            alt={"course img"}
          />
        </div>
      </div>
      <div className="flex flex-col pt-4 px-[10px]">
        <div className="overflow-hidden">
          <Link
            className="text-[15px]  font-semibold hover:text-primary hover:underline text-title font-playfair"
            href="/profile"
          >
            <h2 className="w-full truncate">{data?.title}</h2>
          </Link>
        </div>
      </div>
      <div className="text-sm text-[#6F7582] py-[6px] capitalize px-[10px]">
        {data?.teacher?.name}
      </div>

      <ul className="flex items-center gap-2 px-[10px]">
        <li className="text-sm text-title font-medium">{data?.price}</li>
        <li className="text-sm text-[#6F7582]">
          <del>{data?.estimated_price}</del>
        </li>
      </ul>
    </div>
  );
};

export default Courses;
