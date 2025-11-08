"use client";
import Image from "next/image";
// icons
import { FaCamera } from "react-icons/fa";
import { MdEmojiEmotions, MdPublic } from "react-icons/md";
import { FaUserFriends, FaLock } from "react-icons/fa";
// global package
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
// custom file import
import Post from "./post";
import CreatePostModal from "../CreatePostModal";
import { useProfileData } from "@/shared/context/ProfileDataProvider";

const PostFileds = () => {
  const { profileData, postData } = useProfileData();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full bg-[#f3f3f3] rounded-xl md:p-4">
        {/* write post filed */}
        <div
          className="w-full flex flex-col gap-5 bg-[#f8f8f8] rounded-xl border border-[#c9c9c9] cursor-pointer"
          onClick={onOpen}
        >
          <div className="w-full flex items-center gap-2 border-b border-[#c9c9c9] py-4 px-4">
            <div>
              <div className="md:w-[50px] w-[40px] md:h-[50px] h-[40px] rounded-full ">
                <Image
                  className="rounded-full w-full h-full object-cover"
                  width={50}
                  height={50}
                  src={profileData?.profile || "/user-1.jpg"}
                  alt="post image"
                />
              </div>
            </div>
            <div className="text-[gray]">Share what&apos;s your mind ...</div>
          </div>
          <div className="w-full flex items-center gap-3 pb-4 px-4">
            <div>
              <FaCamera className="text-[20px] text-[gray]" />
            </div>
            <div>
              <MdEmojiEmotions className="text-[22px] text-[gray]" />
            </div>
          </div>
        </div>
        {/* post modal */}
        <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
          <CreatePostModal type="create" />
        </Modal>
      </div>
      {/* posts */}
      <div className="w-full flex flex-col gap-5">
        {postData?.map((p: PostDataTypes, i) => (
          <Post data={p} key={"sdg" + i} />
        ))}
      </div>
    </div>
  );
};

export default PostFileds;
