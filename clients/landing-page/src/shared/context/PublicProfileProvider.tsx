"use client";
import {
  COURSES_QUERY,
  POSTS_QUERY,
  SINGLE_ORGANIZATION_QUERY,
  SINGLE_TEACHER_QUERY,
} from "@/graphql/queries";
import {
  OperationVariables,
  WatchQueryOptions,
  useQuery,
} from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useMemo } from "react";
import rswitch from "rswitch";

type ProviderData = {
  postData?: PostDataTypes[];
  profileData: ProfileData;
  imageData: string[];
  courseData?: CourseData[];
  updatePostQuery: <TVars extends OperationVariables = OperationVariables>(
    mapFn: (
      previousQueryResult: any,
      options: Pick<WatchQueryOptions<TVars, any>, "variables">
    ) => any
  ) => void;
};

const PublicProfileDataContext = createContext({} as ProviderData);

type Props = {
  children?: ReactNode;
};

function PublicProfileDataProvider({ children }: Props) {
  const params = useParams();

  const userType = params.type as string;
  const userId = params.userId as string;

  const USER_QUERY = rswitch(userType, {
    teacher: SINGLE_TEACHER_QUERY,
    organization: SINGLE_ORGANIZATION_QUERY,
  });

  const router = useRouter();

  const { data: publicUserData } = useQuery(USER_QUERY, {
    variables: {
      id: Number(userId),
    },
    skip: !userType || !userId,
    onError: () => {
      router.push("/profile");
    },
  });

  const profileData = rswitch(userType, {
    teacher: publicUserData?.teacher,
    organization: publicUserData?.organization,
  });

  const { data: postData, updateQuery } = useQuery(POSTS_QUERY, {
    variables: {
      [`${userType}Id`]: {
        equals: Number(userId),
      },
    },
  });

  const whereCourse = rswitch(userType, {
    teacher: {
      teacherId: {
        equals: Number(userId),
      },
    },
    organization: {
      teacher: {
        is: {
          organizationId: {
            equals: Number(userId),
          },
        },
      },
    },
  });

  const { data: coursesData } = useQuery(COURSES_QUERY, {
    variables: {
      where: whereCourse,
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
    <PublicProfileDataContext.Provider
      value={{
        postData: postData?.posts,
        profileData,
        updatePostQuery: updateQuery,
        imageData,
        courseData: coursesData?.courses || [],
      }}
    >
      {children}
    </PublicProfileDataContext.Provider>
  );
}

export const usePublicProfileData = () => useContext(PublicProfileDataContext);

export default PublicProfileDataProvider;
