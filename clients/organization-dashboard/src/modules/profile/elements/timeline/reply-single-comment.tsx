import Image from "next/image";
import React, { useState } from "react";
// global packages
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  useDisclosure,
} from "@nextui-org/react";
// icons
import { HiDotsVertical } from "react-icons/hi";
// custom file import
import CommentFiled from "./commentFiled";
import _ from "lodash";
import Moment from "react-moment";
import { useProfileData } from "@/shared/context/ProfileDataProvider";
import DeleteCommentModal from "./DeleteCommentModal";

type Props = {
  data?: CommentType;
  commentId?: number | string;
};

const ReplySingleComment = ({ data, commentId }: Props) => {
  // state
  const [reply, setReply] = useState<boolean>(false);

  const { profileData } = useProfileData();

  const postProfile: TeacherOrganization = _.get(data, `${data?.userType}`);

  const isOwnComment =
    profileData?.id?.toString() == postProfile?.id?.toString() &&
    data?.userType == "organization";

  const { isOpen: editModal, onOpenChange: editModalChange } = useDisclosure();
  const {
    isOpen: replyForm,
    onOpenChange: replyFormChange,
    onClose: replyFormClose,
  } = useDisclosure();

  const { isOpen: deleteModal, onOpenChange: deleteModalChange } =
    useDisclosure();

  return (
    <div>
      <div className="w-full flex  justify-between items-start gap-3 group">
        <div className="w-auto">
          <div className="md:w-[40px] w-[30px] md:h-[40px] h-[30px]">
            <Image
              className="w-full h-full rounded-full object-cover"
              width={40}
              height={40}
              src={postProfile?.profile || "/user-1.jpg"}
              alt={"profile"}
            />
          </div>
        </div>
        <div className="flex justify-between gap-5 w-[calc(100%-40px)] ">
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center gap-2">
              <div className="text-[15px] flex flex-col md:flex-row md:items-center md:gap-2">
                <span className="font-[500] text-[#000]">
                  {postProfile?.name}
                </span>
                <span className="text-sm text-[gray] ">
                  <Moment date={data?.updatedAt} fromNow />{" "}
                </span>
              </div>
              {isOwnComment && (
                <div className="opacity-0 group-hover:opacity-100">
                  <Dropdown>
                    <DropdownTrigger className="!bg-[transparent]">
                      <button>
                        <HiDotsVertical
                          className="dark:text-white text-black cursor-pointer"
                          size={16}
                        />
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                      <DropdownItem
                        onClick={editModalChange}
                        key="new"
                        color="success"
                      >
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        onClick={deleteModalChange}
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
            {!editModal && (
              <div>
                <div>
                  <p className="text-[15px] text-[#000]">{data?.message}</p>
                </div>
                {data?.img && (
                  <div className="py-1">
                    <Image
                      className="max-w-full w-fit max-h-[150px]"
                      src={data?.img}
                      width={300}
                      height={150}
                      alt="img"
                    />
                  </div>
                )}
                <div
                  className="text-sm text-[gray] w-max cursor-pointer hover:text-[black]"
                  onClick={replyFormChange}
                >
                  Reply
                </div>
              </div>
            )}

            {editModal && (
              <div className="mt-3">
                <CommentFiled
                  type="edit"
                  data={data}
                  onCancel={editModalChange}
                />
              </div>
            )}

            <Modal isOpen={deleteModal} onOpenChange={deleteModalChange}>
              <DeleteCommentModal data={data} />
            </Modal>
          </div>
        </div>
      </div>
      {replyForm && (
        <div className="mt-3">
          <CommentFiled
            data={{ message: "@" + postProfile?.name + " " } as any}
            type="reply"
            onCancel={replyFormClose}
            commentId={commentId}
          />
        </div>
      )}
    </div>
  );
};

export default ReplySingleComment;
