import { CREATE_LIKE, DELETE_LIKE } from "@/graphql/queries";
import { usePublicProfileData } from "@/shared/context/PublicProfileProvider";
import useUserData from "@/shared/hooks/useUserData";
import { useMutation } from "@apollo/client";
import { useMemo } from "react";
import { AiOutlineLike } from "react-icons/ai";

type Props = {
  likes?: PostLikeType[];
  postId?: number | string;
};

function LikeComponent({ likes, postId }: Props) {
  const { updatePostQuery } = usePublicProfileData();
  const { userData } = useUserData();

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
          userType: "student",
          student: {
            connect: {
              id: Number(userData?.id),
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
                id: "id" + "student" + userData?.id + postId,
                userType: "student",
                postId,
                teacherId: "test",
                studentId: userData?.id,
                organizationId: "test",
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
          studentId: {
            equals: Number(userData?.id),
          },
          userType: {
            equals: "student",
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
                  v.userType == "student" &&
                  v.studentId == userData?.id &&
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
        v.userType == "student" &&
        v.studentId == userData?.id &&
        v.postId == postId
    );
    return findLikes;
  }, [likes, postId, userData]);

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
