import { CREATE_LIKE, DELETE_LIKE } from "@/graphql/queries";
import { useProfileData } from "@/shared/context/ProfileDataProvider";
import { useMutation } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import _ from "lodash";

type Props = {
  likes?: PostLikeType[];
  postId?: number | string;
};

function LikeComponent({ likes, postId }: Props) {
  const { profileData, updatePostQuery } = useProfileData();

  const [createLike] = useMutation(CREATE_LIKE);
  const [deleteLike] = useMutation(DELETE_LIKE);

  async function addLike() {
    createLike({
      variables: {
        input: {
          post: {
            connect: {
              id: Number(postId),
            },
          },
          userType: "organization",
          organization: {
            connect: {
              id: Number(profileData.id),
            },
          },
        },
      },
    });
    updatePostQuery((prev, opt) => {
      let posts: any[] = prev.posts ? [...prev.posts] : [];

      return {
        posts: posts.map((v) => {
          if (v.id == postId) {
            let likes = [
              ...v.likes,
              {
                id: "id" + "organization" + profileData.id + postId,
                userType: "organization",
                postId,
                teacherId: "test",
                studentId: "test",
                organizationId: profileData.id,
              },
            ];

            return { ...v, likes };
          } else {
            return v;
          }
        }),
      };
    });
  }

  async function unLike() {
    deleteLike({
      variables: {
        where: {
          organizationId: {
            equals: Number(profileData.id),
          },
          userType: {
            equals: "teacher",
          },
          postId: {
            equals: Number(postId),
          },
        },
      },
    });
    updatePostQuery((prev, opt) => {
      let posts: any[] = prev.posts ? [...prev.posts] : [];

      return {
        posts: posts.map((v) => {
          if (v.id == postId) {
            let likes = [...v.likes].filter(
              (v) =>
                !(
                  v.userType == "organization" &&
                  v.organizationId == profileData?.id &&
                  v.postId == postId
                )
            );

            return { ...v, likes };
          } else {
            return v;
          }
        }),
      };
    });
  }

  const isLike = useMemo(() => {
    const findLikes = (likes || []).find(
      (v) =>
        v.userType == "organization" &&
        v.organizationId == profileData?.id &&
        v.postId == postId
    );
    return findLikes;
  }, [likes, postId, profileData]);

  return (
    <div
      className="flex items-center gap-2 group cursor-pointer"
      onClick={() => (isLike ? unLike() : addLike())}
    >
      {isLike ? (
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
          isLike ? "text-[#7aacf8]" : "text-[gray] group-hover:text-[#000]"
        }
      >
        Like
      </span>
    </div>
  );
}

export default LikeComponent;
