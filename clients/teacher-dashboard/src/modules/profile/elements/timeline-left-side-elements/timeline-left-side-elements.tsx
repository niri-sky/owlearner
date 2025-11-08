import { useProfileData } from "@/shared/context/ProfileDataProvider";
import Image from "next/image";
import React from "react";

const TimelineLeftSideElements = () => {
  const { profileData } = useProfileData();

  return (
    <div className="xl:w-[40%] xl:block hidden w-full xl:order-1 order-2 xl:sticky xl:top-[10px]">
      <div className="w-full border border-[#e2e2e2] rounded-md p-[10px]">
        <div className="w-full flex flex-col gap-3">
          <h2 className="text-[16px] font-medium">
            Followers {profileData?.followers?.length || 0}
          </h2>
          <div className="grid xl:grid-cols-4 lg:grid-cols-12 md:grid-cols-8 sm:grid-cols-8 grid-cols-5 items-center gap-3">
            {profileData?.followers?.map((item, i) => (
              <div
                key={i}
                className="w-[40px] h-[40px] rounded-full hover:border-2 hover:border-[gray] cursor-pointer"
              >
                <Image
                  className="w-full h-full object-cover rounded-full "
                  width={40}
                  height={40}
                  src="/images/profile.png"
                  alt="Image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineLeftSideElements;
