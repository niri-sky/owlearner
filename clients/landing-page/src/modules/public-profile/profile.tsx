"use client";
// icons
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
// global package
// custom file imports

import UploadCoverImage from "./UploadCoverImage";
import UploadProfileImage from "./UploadProfileImage";
import Courses from "./elements/courses/courses";
import { Tab, Tabs } from "./elements/tab";
import TimelineLeftSideElements from "./elements/timeline-left-side-elements/timeline-left-side-elements";
import PostFileds from "./elements/timeline/post-fileds";

import { usePublicProfileData } from "@/shared/context/PublicProfileProvider";
import { formatDate } from "@/shared/utils";
import rswitch from "rswitch";
import PaginationWrapper from "./elements/PaginationWrapper";

const SOCIAL_MEDIA_ICONS = (key: string) =>
  rswitch(key, {
    facebook: <FaFacebook className="text-[18px] text-[white]" />,
    youtube: <FaYoutube className="text-[18px] text-[white]" />,
    instagram: <FaInstagram className="text-[18px] text-[white]" />,
    twitter: <FaTwitter className="text-[18px] text-[white]" />,
    linkedin: <FaYoutube className="text-[18px] text-[white]" />,
  });

const PublicProfile = () => {
  const { profileData, imageData, courseData } = usePublicProfileData();

  return (
    <div className="container">
      <div className="w-full xl:flex-row flex-col flex lg:gap-5 gap-3 relative">
        {/* <div className="xl:w-[75%] w-full self-start"> */}
        <div className="w-full self-start">
          <div className="w-full flex flex-col gap-4">
            {/* cover image */}
            <div className="border  border-[#e2e2e2] rounded-b-xl pb-6">
              <UploadCoverImage cover={profileData?.cover} />
              <div className="w-full flex flex-col items-center justify-center lg:mt-[-135px] md:mt-[-110px] mt-[-100px]">
                <UploadProfileImage profile={profileData?.profile} />
                <div className="flex justify-center items-center flex-col">
                  <h2 className="md:text-[30px] text-[24px] pt-2 font-bold text-txt">
                    {profileData?.name}
                  </h2>

                  <ul className="flex items-center gap-2 text-sm text-[#919191] pb-1">
                    {profileData?.username && (
                      <li>@{profileData?.username} • </li>
                    )}
                    <li>Joined {formatDate(profileData?.joinedAt)}</li>
                  </ul>
                  <ul className="flex items-center gap-2 text-sm text-[#919191] pb-4">
                    <li className="cursor-pointer hover:underline hover:text-txt">
                      <span className="text-txt font-medium ">
                        {profileData?.followers?.length || 0}
                      </span>{" "}
                      followers
                    </li>
                  </ul>

                  {profileData?.links && profileData?.links?.length > 0 && (
                    <ul className="flex items-center gap-2">
                      {profileData.links.map((v, i) => (
                        <li key={"sgd" + i}>
                          <a
                            href={v.link}
                            target="_blank"
                            className="w-[28px] h-[28px] rounded-full flex justify-center items-center bg-txt text-[20px] hover:bg-[#40ade3]"
                          >
                            {SOCIAL_MEDIA_ICONS(v.type)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* tabs */}
            <div>
              <Tabs>
                {/* Timeline tab */}
                <Tab label="Timeline">
                  <div className="flex xl:flex-row flex-col w-full items-start gap-5">
                    <TimelineLeftSideElements />
                    <div className="w-full xl:order-2 order-1">
                      <PostFileds />
                    </div>
                  </div>
                </Tab>
                {/* Profile tab */}

                {/* Courses tab */}
                <Tab label="Courses" subCount={`${courseData?.length || 0}`}>
                  <PaginationWrapper dataArr={courseData || []}>
                    {(d) => (
                      <div className="w-full grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1  items-center gap-5">
                        {d?.map((c: CourseData, i) => (
                          <Courses data={c} key={i} />
                        ))}
                      </div>
                    )}
                  </PaginationWrapper>
                  {courseData?.length == 0 && (
                    <div className="pb-36">
                      <div>No courses found</div>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-28"> </div>
    </div>
  );
};

export default PublicProfile;
