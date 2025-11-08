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
  POSTS_QUERY,
  SINGLE_TEACHER_QUERY,
  UPDATE_TEACHER,
} from "@/graphql/queries";
import useUserData from "../hooks/useUserData";

type ProviderData = {
  updateProfile: (d: any) => Promise<any>;
  postData?: PostDataTypes[];
  profileData: ProfileData;
  imageData: string[];
  courseData?: CourseDataTypes[];
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

  const [updateTeacher] = useMutation(UPDATE_TEACHER, {
    awaitRefetchQueries: true,

    refetchQueries: [
      {
        query: SINGLE_TEACHER_QUERY,
        variables: {
          id: Number(userData?.id),
        },
      },
    ],
  });

  function updateProfile(input: any) {
    return updateTeacher({
      variables: {
        id: Number(userData?.id),
        input,
      },
    });
  }

  const { data: profileData } = useQuery(SINGLE_TEACHER_QUERY, {
    variables: {
      id: Number(userData?.id),
    },
    skip: !userData?.id,
  });

  const { data: postData, updateQuery } = useQuery(POSTS_QUERY);

  const courseData = profileData?.teacher?.courses || [];

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

  console.log(profileData);

  return (
    <ProfileDataContext.Provider
      value={{
        updateProfile,
        postData: postData?.posts,
        profileData: profileData?.teacher,
        updatePostQuery: updateQuery,
        courseData: courseData,
        imageData,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
}

export const useProfileData = () => useContext(ProfileDataContext);

export default ProfileDataProvider;
