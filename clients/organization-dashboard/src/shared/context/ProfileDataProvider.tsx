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
  COURSES_QUERY,
  POSTS_QUERY,
  SINGLE_ORGANIZATION_QUERY,
  UPDATE_ORGANIZATION,
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

  const [updateTeacher] = useMutation(UPDATE_ORGANIZATION, {
    awaitRefetchQueries: true,

    refetchQueries: [
      {
        query: SINGLE_ORGANIZATION_QUERY,
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

  const { data: profileData } = useQuery(SINGLE_ORGANIZATION_QUERY, {
    variables: {
      id: Number(userData?.id),
    },
    skip: !userData?.id,
  });

  const { data: postData, updateQuery } = useQuery(POSTS_QUERY);

  const { data: coursesData } = useQuery(COURSES_QUERY, {
    variables: {
      input: {
        teacher: {
          is: {
            organizationId: {
              equals: 1,
            },
          },
        },
      },
    },
  });

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
        profileData: profileData?.organization,
        updatePostQuery: updateQuery,
        courseData: coursesData?.courses || [],
        imageData,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
}

export const useProfileData = () => useContext(ProfileDataContext);

export default ProfileDataProvider;
