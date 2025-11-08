"use client";
import Image from "next/image";
// icons
import {
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaCamera,
  FaInstagram,
} from "react-icons/fa";
// global package
import { Modal, Pagination, useDisclosure } from "@nextui-org/react";
// custom file imports
import AdminLayout from "@/shared/components/admin-layout";
import { Tab, Tabs } from "./elements/tab";
import GeneralInfo from "./elements/general-info";
import Biography from "./elements/biography";
import SocialLinks from "./elements/social-links";
import PostFileds from "./elements/timeline/post-fileds";
import Courses from "./elements/courses/courses";
import RightSideElements from "./elements/right-side-elements/right-side-elements";
import TimelineLeftSideElements from "./elements/timeline-left-side-elements/timeline-left-side-elements";
import PasswordFileds from "./elements/password-fileds";
import FollowersModal from "./elements/followers-modal";
import FollowingModal from "./elements/following-modal";
import UploadCoverImage from "./UploadCoverImage";
import UploadProfileImage from "./UploadProfileImage";
import { useMutation } from "@apollo/client";
import { UPDATE_TEACHER } from "@/graphql/queries";
import { useProfileData } from "@/shared/context/ProfileDataProvider";
import { formatDate } from "@/shared/utils";
import Zoom from "react-medium-image-zoom";
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

// followers data
const data = [
  {
    userId: "87383638",
    userImg: "/images/profile.png",
    userName: "faisal3267",
    name: "Md Faisal Ahmad",
  },
  {
    userId: "87383665",
    userImg: "/images/profile.png",
    userName: "ahmad3267",
    name: "Ahmad",
  },
  {
    userId: "87383665",
    userImg: "/images/profile.png",
    userName: "ahmad3267",
    name: "Ahmad",
  },
  {
    userId: "87383665",
    userImg: "/images/profile.png",
    userName: "ahmad3267",
    name: "Ahmad",
  },
];

const Profile = () => {
  const { profileData, courseData, imageData } = useProfileData();

  const selfProfile = true;
  // followers state
  const {
    isOpen: followersIsOpen,
    onOpen: followersOnOpen,
    onOpenChange: followersOnOpenChange,
  } = useDisclosure();

  // following state
  const {
    isOpen: followingIsOpen,
    onOpen: followingOnOpen,
    onOpenChange: followingOnOpenChange,
  } = useDisclosure();

  return (
    <AdminLayout>
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
                    <li
                      onClick={followersOnOpen}
                      className="cursor-pointer hover:underline hover:text-txt"
                    >
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
                <Tab label="Profile">
                  <div className="w-full flex flex-col md:gap-5 gap-3">
                    <GeneralInfo />
                    <PasswordFileds />
                    <SocialLinks links={profileData?.links} />
                    <Biography biography={profileData?.biography} />
                  </div>
                </Tab>
                {/* Courses tab */}
                <Tab label="Courses" subCount={`${courseData?.length || 0}`}>
                  <PaginationWrapper dataArr={courseData || []}>
                    {(d) => (
                      <div className="w-full grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1  items-center gap-5">
                        {d?.map((c: CourseDataTypes, i) => (
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
                {/* Photos tab */}
                <Tab label="Photos" subCount={`${imageData?.length || 0}`}>
                  <PaginationWrapper dataArr={imageData || []}>
                    {(d) => (
                      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 items-center gap-[10px]">
                        {d?.map((item, i) => (
                          <div key={"sgd" + i} className="w-full">
                            <div className="w-full rounded-sm sm:h-[190px] md:h-[180px] h-[160px] overflow-hidden">
                              <Zoom>
                                <Image
                                  className="w-full cursor-pointer h-full object-cover rounded-md"
                                  width={200}
                                  height={200}
                                  src={item}
                                  alt="Photo"
                                />
                              </Zoom>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </PaginationWrapper>
                  {imageData?.length == 0 && (
                    <div className="pb-36">
                      <div>No photos found</div>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
        {/* right side elements */}
        {selfProfile ? <></> : <RightSideElements />}

        {/* following modal */}
        <Modal
          scrollBehavior={"inside"}
          isOpen={followersIsOpen}
          onOpenChange={followersOnOpenChange}
        >
          <FollowersModal data={profileData?.followers} />
        </Modal>

        {/* following modal */}
        {/* <FollowingModal
          data={data}
          isOpen={followingIsOpen}
          onOpenChange={followingOnOpenChange}
        /> */}
      </div>
    </AdminLayout>
  );
};

export default Profile;
