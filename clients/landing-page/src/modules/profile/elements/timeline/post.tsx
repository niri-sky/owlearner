"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
// global packages
// icons
import { MdOutlineModeComment } from "react-icons/md";
// custom file imports
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Moment from "react-moment";
import LikeComponent from "./LikeComponent";
import CommentFiled from "./commentFiled";
import SingleComment from "./single-comment";

type Props = {
  data?: PostDataTypes;
};

const Post = ({ data }: Props) => {
  // states

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
      <div className="w-full md:p-[16px] rounded-xl bg-[#f3f3f3]">
        <div className="w-full p-[16px] rounded-xl bg-[white] border border-[#c9c9c9] flex flex-col gap-3">
          {/* post head contents */}
          <div className="w-full flex justify-between items-center gap-3">
            <div className="w-auto">
              <Link
                href={`/profile/public/${data?.userType}/${postProfile.id}`}
              >
                <div className="md:w-[55px] w-[40px] md:h-[55px] h-[40px]">
                  <Image
                    className="w-full h-full rounded-full object-cover"
                    width={50}
                    height={50}
                    src={postProfile?.profile || "/user-1.jpg"}
                    alt="Profile image"
                  />
                </div>
              </Link>
            </div>
            <div className="flex justify-between gap-5 w-full">
              <div className="flex flex-col">
                <h2 className="text-[16px] font-[500]">{postProfile?.name}</h2>
                <p className="text-sm text-[gray]">
                  <Moment date={data?.updatedAt} fromNow />
                </p>
              </div>
            </div>
          </div>
          {/* post image */}
          <div className="w-full flex flex-col gap-4">
            <p className="text-[16px] w-full">{data?.text}</p>
            {data?.img && (
              <Link href={`/profile/post/${data.id}`}>
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
              </Link>
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
    </>
  );
};

export default Post;
