"use client";

import AdminLayout from "@/shared/components/admin-layout";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import SingleComment from "./single-comment";
import { MdOutlineModeComment } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import CommentFiled from "./commentFiled";
import { singleComment } from "../../data";
import LeftArrow from "@/shared/icons/LeftArrow";
const ReactShowMoreText = dynamic(() => import("react-show-more-text"), {
  ssr: false,
});

const PostPhoto = () => {
  const router = useRouter();
  const search = useSearchParams();
  const [like, setLike] = useState<boolean>(false);
  const [comment, setComment] = useState<boolean>(false);
  const [commentArea, setCommentArea] = useState<boolean>(false);

  if (!search?.get("postid")) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="">Sorry you made a mistake</div>
        <div
          onClick={() => router.back()}
          className="cursor-pointer hover:underline flex items-center"
        >
          <LeftArrow />
          go back
        </div>
      </div>
    );
  }
  return (
    <AdminLayout>
      <div className="w-full h-[calc(100vh_-_120px)] flex flex-col lg:flex-row gap-2 lg:gap-0">
        {/* left side of post */}
        <div className="h-[45%] lg:h-full lg:w-[70%] overflow-hidden flex flex-col justify-center items-center relative bg-black">
          <div className="w-[80%] h-full mx-auto object-contain">
            <Image
              src={"/images/post-image.jpg"}
              width={2000}
              height={2000}
              quality={95}
              alt={"demo imae"}
              className="!h-full !w-full "
            />
          </div>
        </div>
        <div className="w-full h-[55%] lg:h-[calc(100vh_-_120px)] lg:w-[30%] flex flex-col p-4 lg:border-t lg:border-r border-slate-300">
          {/* right side top menu of post */}
          <div className="w-full flex justify-between items-center">
            {/* user info */}
            <div className="flex items-center gap-2">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <div className="flex flex-col mb-[2px]">
                <h4>Faisal Ahmed</h4>
                <span className="text-xs">January 5</span>
              </div>
            </div>
            {/* three do icons */}
            <div className="!w-[36px] !h-[36px] flex items-center justify-center mr-1">
              <Dropdown className="!w-full !h-full">
                <DropdownTrigger className="!bg-[transparent]">
                  <Button className="!bg-[transparent]">
                    <HiDotsHorizontal
                      className="dark:text-white text-black cursor-pointer"
                      size={16}
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="delete" color="danger">
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt
              magnam inventore omnis unde similique ea quam illo fuga culpa
              exercitationem perferendis asperiores ad soluta reprehenderit
              recusandae harum porro eveniet quasi sequi aliquid, temporibus
              suscipit. Hic tempora ullam, est in tenetur quae ut molestiae
              quidem eligendi ab neque esse blanditiis enim optio saepe dolore
              eum nesciunt. Est quos repellat, nisi quam similique
              exercitationem, saepe illo cum asperiores minima, quia at!
              Recusandae nemo asperiores reprehenderit neque temporibus earum,
              nostrum, ipsa at ducimus sed illo libero magni exercitationem aut
              mollitia. Et aliquid repellendus fugit voluptate exercitationem
              itaque quas repudiandae! Quae laborum quis soluta ducimus a nihil
              sint deleniti iusto, molestias cum temporibus illo nam iste ad
              fugiat consequuntur rerum hic ex nulla officiis repudiandae eius
              suscipit? Itaque veniam placeat, quaerat unde corporis deserunt ea
              expedita fuga. Modi asperiores dicta illum in adipisci, temporibus
              officiis. Iste natus repudiandae voluptas hic non est eos quos
              molestias esse officia ut, aut provident et deleniti id ea
              deserunt qui! Repudiandae ad animi accusamus autem reprehenderit
              omnis officia perferendis, minima placeat rerum officiis provident
              doloribus odio odit, vitae inventore veritatis recusandae minus
              itaque beatae pariatur, explicabo assumenda vero ut! Similique
              neque voluptas, consectetur quibusdam nulla iste? At praesentium
              totam cupiditate porro voluptatem molestiae, qui architecto enim
              officia ea ad vel aliquam rem nisi corrupti placeat deleniti
              similique. Officiis ea libero in assumenda saepe illum voluptatum
              explicabo velit eligendi magni at excepturi repellat, vel sequi
              architecto provident nostrum atque voluptate. Accusantium ipsa
              rerum sunt tempora dolores, reiciendis adipisci eligendi rem
              suscipit deleniti aspernatur consequatur tenetur, doloremque
              doloribus ipsam voluptatum recusandae laudantium? Vero expedita
              repellendus pariatur? Nobis ex consequatur dolore quam iure
              eligendi, sed, cum architecto non voluptate repellendus sunt
              blanditiis illo natus placeat ducimus. Nihil inventore,
              perferendis possimus doloribus similique maxime, pariatur
              explicabo sint nulla esse delectus doloremque commodi maiores
              rerum praesentium. Quos, minus omnis, illo error aliquid in natus
              quam ullam excepturi, vero atque architecto? Ipsum molestias
              consequatur incidunt aspernatur nesciunt nostrum quas voluptatibus
              sit! Natus ea quasi facilis asperiores. Odio deleniti dolore
              laboriosam natus nemo quas, commodi distinctio cum voluptatibus
              iure quo architecto et! Fuga, quaerat dolorum aspernatur mollitia
              autem nemo ab! A nobis fugiat hic vero laudantium suscipit quidem
              soluta minus exercitationem cum mollitia aut, deleniti ut
              perspiciatis voluptatem dolores vitae natus odit rem. Consequuntur
              doloribus animi accusantium dolor nisi consequatur ipsum atque,
              quidem nam debitis obcaecati laudantium impedit veritatis enim
              ducimus nulla est recusandae libero!
            </ReactShowMoreText>

            {/* like and comment */}
            <div className="w-full flex items-center mt-2 gap-3">
              <p className="text-sm text-[gray]">1 Like</p>
              <p className="text-sm text-[gray]">1 Comment</p>
            </div>

            {/* like and comment */}
            <div className="w-full flex mt-2 items-center gap-3 border-gray-400 border-t border-b px-3 py-2 my-3">
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => setLike(!like)}
              >
                {like ? (
                  <span className="text-lg text-[#7aacf8] ">
                    <AiOutlineLike />
                  </span>
                ) : (
                  <span className="text-lg text-[gray] group-hover:text-[#000]">
                    <AiOutlineLike />
                  </span>
                )}
                <span
                  className={
                    like
                      ? "text-[#7aacf8]"
                      : "text-[gray] group-hover:text-[#000]"
                  }
                >
                  Like
                </span>
              </div>
              <div
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => setComment(!comment)}
              >
                {comment ? (
                  <span className="text-lg text-[gray] group-hover:text-[#000]">
                    <MdOutlineModeComment />
                  </span>
                ) : (
                  <span className="text-lg text-[gray] group-hover:text-[#000]">
                    <MdOutlineModeComment />
                  </span>
                )}

                <span
                  className={
                    comment
                      ? "text-[gray] group-hover:text-[#000]"
                      : "text-[gray] group-hover:text-[#000]"
                  }
                  onClick={() => setCommentArea(!commentArea)}
                >
                  Comment
                </span>
              </div>
            </div>
            {/* comments */}
            {/* {commentArea && (
              <div className="w-full flex flex-col gap-3 py-[16px] bg-[#f3f3f3]">
                {singleComment.map(
                  (
                    { name, comment, img, postTime }: SingleCommentTypes,
                    i: number
                  ) => (
                    <SingleComment
                      key={i}
                      name={name}
                      img={img}
                      postTime={postTime}
                      comment={comment}
                    />
                  )
                )}

                <CommentFiled
                  userImg="/images/profile.png"
                  setCommentArea={setCommentArea}
                />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default PostPhoto;
