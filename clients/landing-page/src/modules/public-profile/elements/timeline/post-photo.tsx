"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from "@nextui-org/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import SingleComment from "./single-comment";
import { MdOutlineModeComment } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import CommentFiled from "./commentFiled";

import LeftArrow from "@/shared/icons/LeftArrow";
import _ from "lodash";
import Moment from "react-moment";
import LikeComponent from "./LikeComponent";
const ReactShowMoreText = dynamic(() => import("react-show-more-text"), {
  ssr: false,
});

type Props = {
  data?: PostDataTypes;
};

const PostPhoto = ({ data }: Props) => {
  const [commentArea, setCommentArea] = useState<boolean>(false);
  //
  const router = useRouter();

  const postProfile: TeacherOrganization = _.get(data, `${data?.userType}`);

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
      <div
        className={cn(
          "w-full h-[calc(100vh_-_120px)] flex flex-col lg:flex-row gap-2 lg:gap-0",
          !data?.img && "lg:justify-center "
        )}
      >
        {/* left side of post */}
        {data?.img && (
          <div className="h-[45%] lg:h-full lg:w-[70%] overflow-hidden flex flex-col justify-center items-center relative bg-black">
            <div className="w-[80%] h-full mx-auto object-contain">
              <Image
                src={data?.img}
                width={500}
                height={500}
                quality={95}
                alt={"demo imae"}
                className="!h-full !w-full "
              />
            </div>
          </div>
        )}

        <div
          className={cn(
            "w-full h-[55%] lg:h-[calc(100vh_-_120px)] lg:w-[30%] flex flex-col p-4 lg:border-t lg:border-r border-slate-300",
            !data?.img && "lg:border-l"
          )}
        >
          {/* right side top menu of post */}
          <div className="w-full flex justify-between items-center">
            {/* user info */}
            <div className="flex items-center gap-2">
              <Avatar src={postProfile?.profile || "/user-1.jpg"} />
              <div className="flex flex-col mb-[2px]">
                <h4>{postProfile?.name}</h4>
                <span className="text-xs">
                  <Moment date={data?.updatedAt} fromNow />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col overflow-hidden overflow-y-auto h-screen relative">
            {/* post body */}
            <ReactShowMoreText
              lines={8}
              more={<span className="cursor-pointer">see more</span>}
              less={<span className="cursor-pointer">see less</span>}
              className="content-css"
              anchorClass="show-more-less-clickable"
              truncatedEndingComponent={"... "}
            >
              {data?.text}
            </ReactShowMoreText>

            {/* like and comment */}
            <div className="w-full flex items-center mt-2 gap-3">
              <p className="text-sm text-[gray]">
                {" "}
                {data?.likes?.length || 0} Like
                {(data?.likes?.length || 0) > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-[gray]">
                {totalComments || 0} Comment
                {(totalComments || 0) > 1 ? "s" : ""}
              </p>
            </div>

            {/* like and comment */}
            <div className="w-full flex mt-2 items-center gap-3 border-gray-400 border-t border-b px-3 py-2 my-3">
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
      </div>
    </>
  );
};
export default PostPhoto;
