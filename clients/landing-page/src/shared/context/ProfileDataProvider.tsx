"use client";
import { ReactNode, createContext, useContext, useMemo } from "react";
import _ from "lodash";
import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
  WatchQueryOptions,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  FOLLOWING_USERS,
  POSTS_QUERY,
  SINGLE_STUDENT_QUERY,
  UPDATE_STUDENT,
} from "@/graphql/queries";
import useUserData from "../hooks/useUserData";
import { signOut, useSession } from "next-auth/react";

type ProviderData = {
  updateProfile: (d: any) => Promise<any>;
  postData?: PostDataTypes[];
  profileData: ProfileData;
  imageData: string[];
  courseData?: CourseData[];
  followingUsers: FollowingUser[];
  updatePostQuery: <TVars extends OperationVariables = OperationVariables>(
    mapFn: (
      previousQueryResult: any,
      options: Pick<WatchQueryOptions<TVars, any>, "variables">
    ) => any
  ) => void;
};

const ProfileDataContext = createContext({} as ProviderData);

type Props = {
  children?: ReactNode;
};

function ProfileDataProvider({ children }: Props) {
  const { userData } = useUserData();

  const { update } = useSession();

  const { data: studentData } = useQuery(SINGLE_STUDENT_QUERY, {
    variables: {
      id: Number(userData?.id),
    },
    skip: !userData?.id,
    onCompleted: (d) => {
      const profileData = d?.student;
      update({
        user: {
          id: profileData?.id,
          name: profileData?.name,
          email: profileData?.email,
          profile: profileData?.profile,
          joinedAt: profileData?.joinedAt,
        },
      });
    },
    onError: () => {
      signOut();
    },
  });

  const profileData = studentData?.student;

  const [updateStudent] = useMutation(UPDATE_STUDENT, {
    awaitRefetchQueries: true,

    refetchQueries: [
      {
        query: SINGLE_STUDENT_QUERY,
        variables: {
          id: Number(userData?.id),
        },
      },
    ],
  });

  function updateProfile(input: any) {
    return updateStudent({
      variables: {
        id: Number(userData?.id),
        input,
      },
    });
  }

  const { data: postData, updateQuery } = useQuery(POSTS_QUERY);

  const { data: followingUsersData } = useQuery(FOLLOWING_USERS, {
    variables: {
      studentId: Number(userData?.id),
    },
    skip: !userData?.id,
  });

  const followingUsers = followingUsersData?.followingUsers || [];

  const imageData = useMemo(() => {
    const posts: any[] = postData?.posts || [];
    let imgs: string[] = [];

    posts?.forEach((v) => {
      if (v.img) {
        imgs.push(v.img);
      }
    });
    return imgs;
  }, [postData]);

  return (
    <ProfileDataContext.Provider
      value={{
        updateProfile,
        postData: postData?.posts,
        profileData,
        updatePostQuery: updateQuery,
        imageData,
        courseData: [],
        followingUsers,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
}

export const useProfileData = () => useContext(ProfileDataContext);

export default ProfileDataProvider;
