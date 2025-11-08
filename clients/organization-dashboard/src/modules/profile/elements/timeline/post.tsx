"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
// global packages
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
// icons
import { HiDotsHorizontal } from "react-icons/hi";
import { AiOutlineLike } from "react-icons/ai";
import {
  MdEmojiEmotions,
  MdOutlineModeComment,
  MdPublic,
} from "react-icons/md";
// custom file imports
import SingleComment from "./single-comment";
import { singleComment } from "../../data";
import CommentFiled from "./commentFiled";
import { FaCamera, FaLock, FaUserFriends } from "react-icons/fa";
import { useRouter } from "next/navigation";
import _ from "lodash";
import Moment from "react-moment";
import { useProfileData } from "@/shared/context/ProfileDataProvider";
import CreatePostModal from "../CreatePostModal";
import DeletePostModal from "./DeletePostModal";
import LikeComponent from "./LikeComponent";

type Props = {
  data?: PostDataTypes;
};

const Post = ({ data }: Props) => {
  // states

  const [commentArea, setCommentArea] = useState<boolean>(false);
  //
  const router = useRouter();

  const { profileData } = useProfileData();

  const postProfile: TeacherOrganization = _.get(data, `${data?.userType}`);

  const isOwnPost =
    profileData?.id?.toString() == postProfile?.id?.toString() &&
    data?.userType == "organization";

  const { isOpen: editModal, onOpenChange: editModalChange } = useDisclosure();

  const { isOpen: deleteModal, onOpenChange: deleteModalChange } =
    useDisclosure();

  const { totalComments } = useMemo(() => {
    const comments = data?.comments || [];

    let totalLength = 0;

    comments.forEach((v) => {
      totalLength++;
      totalLength += v.replies?.length || 0;
    });

    return {
      totalComments: totalLength,
    };
  }, [data]);

  return (
    <>
      <div className="w-full md:p-[16px] rounded-xl bg-[#f3f3f3]">
        <div className="w-full p-[16px] rounded-xl bg-[white] border border-[#c9c9c9] flex flex-col gap-3">
          {/* post head contents */}
          <div className="w-full flex justify-between items-center gap-3">
            <div className="w-auto">
              <div className="md:w-[55px] w-[40px] md:h-[55px] h-[40px]">
                <Image
                  className="w-full h-full rounded-full object-cover"
                  width={50}
                  height={50}
                  src={postProfile?.profile || "/user-1.jpg"}
                  alt="Profile image"
                />
              </div>
            </div>
            <div className="flex justify-between gap-5 w-full">
              <div className="flex flex-col">
                <h2 className="text-[16px] font-[500]">{postProfile?.name}</h2>
                <p className="text-sm text-[gray]">
                  <Moment date={data?.updatedAt} fromNow />
                </p>
              </div>
              {isOwnPost && (
                <div className="w-max">
                  <Dropdown>
                    <DropdownTrigger className="!bg-[transparent]">
                      <Button className="!bg-[transparent]">
                        <HiDotsHorizontal
                          className="dark:text-white text-black cursor-pointer"
                          size={16}
                        />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                      <DropdownItem
                        onPress={editModalChange}
                        key="edit"
                        color="success"
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        onPress={deleteModalChange}
                        key="delete"
                        color="danger"
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
          {/* post image */}
          <div className="w-full flex flex-col gap-4">
            <p className="text-[16px] w-full">{data?.text}</p>
            {data?.img && (
              <div className="w-full h-full">
                <div className="w-full lg:h-[400px] md:h-[220px] h-[250px]">
                  <Image
                    className="w-full h-full object-cover cursor-pointer rounded-md"
                    width={500}
                    height={300}
                    src={data?.img}
                    alt={data?.text}
                    // onClick={() => router.push(`/photo?postid=${postid}`)}
                  />
                </div>
              </div>
            )}

            <div className="w-full flex items-center gap-3">
              <p className="text-sm text-[gray]">
                {data?.likes?.length || 0} Like
                {(data?.likes?.length || 0) > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-[gray]">
                {totalComments || 0} Comment
                {(totalComments || 0) > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {/* like and comment */}
          <div className="w-full flex items-center gap-3">
            <LikeComponent likes={data?.likes} postId={data?.id} />
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => setCommentArea(!commentArea)}
            >
              <span className="text-lg text-[gray] group-hover:text-[#000]">
                <MdOutlineModeComment />
              </span>
              <span className={"text-[gray] group-hover:text-[#000]"}>
                Comment
              </span>
            </div>
          </div>
          {/* comments */}
          {commentArea && (
            <div className="w-full flex flex-col gap-3 p-[16px] bg-[#f3f3f3]">
              {data?.comments?.map((d, i) => (
                <SingleComment key={"gdf" + i} data={d} />
              ))}

              {/* write comment filed */}
              <CommentFiled
                type="create"
                postData={data}
                onCancel={() => setCommentArea(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* modal */}
      <Modal size="xl" isOpen={editModal} onOpenChange={editModalChange}>
        <CreatePostModal data={data} type="edit" />
      </Modal>

      <Modal isOpen={deleteModal} onOpenChange={deleteModalChange}>
        <DeletePostModal data={data} />
      </Modal>
    </>
  );
};

export default Post;
