import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { CourseDataType, VideoContentType } from "../utils/types";
import _ from "lodash";
import { useMutation } from "@apollo/client";
import {
  SINGLE_COURSES_QUERY,
  UPDATE_COURSE,
  UPDATE_COURSE_CONTENT,
  UPDATE_STUDENT_COURSE,
} from "@/graphql/queries";
import { useParams } from "next/navigation";
import { useStudentData } from "./StudentDataProvider";
import useUserData from "../hooks/useUserData";

type ProviderData = {
  activeContent: {
    section: number;
    content: number;
  };
  updateCourse: (d: any) => Promise<void>;
  updateCourseContent: (d: any) => Promise<void>;
  updateStudentCourse: (d: any) => Promise<void>;
  onContentSelect: (content: number, section?: number) => any;
  data: CourseData;
  studentCourse?: StudentCourse;
  activeContentData: Content & { contentNumber: number };
};

const CourseAccessContext = createContext({} as ProviderData);

type Props = {
  children?: ReactNode;
  data: CourseData;
};

function CourseAccessProvider({ children, data }: Props) {
  const params = useParams();
  const [courseUpdate] = useMutation(UPDATE_COURSE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: SINGLE_COURSES_QUERY,
        variables: {
          slug: params.slug,
        },
      },
    ],
  });

  const [contentUpdate] = useMutation(UPDATE_COURSE_CONTENT, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: SINGLE_COURSES_QUERY,
        variables: {
          slug: params.slug,
        },
      },
    ],
  });
  const [studentCourseUpdate] = useMutation(UPDATE_STUDENT_COURSE, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: SINGLE_COURSES_QUERY,
        variables: {
          slug: params.slug,
        },
      },
    ],
  });

  const [activeContent, setContentSelect] = useState({
    section: 0,
    content: 0,
  });

  const onContentSelect = (content: number, section?: number) => {
    setContentSelect((s) => ({
      content,
      section: typeof section == "undefined" ? s.section : section,
    }));
  };

  const { activeContentData } = useMemo(() => {
    const acd = _.get(
      { ...data },
      `section.[${activeContent.section}].content.[${activeContent.content}]`
    ) as any;

    let prevIndex = 0;
    for (let i = 0; i < activeContent.section; i++) {
      const section = data?.section;
      if (section) {
        const sec = section[i];
        prevIndex += sec.content.length;
      }
    }

    const activeContentData = Object.assign(
      { contentNumber: prevIndex + activeContent.content + 1 },
      acd
    );

    return { activeContentData };
  }, [data, activeContent]);

  async function updateCourse(d: any) {
    await courseUpdate({
      variables: {
        id: Number(data?.id),
        input: d,
      },
    });
  }
  async function updateCourseContent(d: any) {
    if (!activeContentData) return;
    await contentUpdate({
      variables: {
        id: Number(activeContentData?.id),
        input: d,
      },
    });
  }

  const { userData } = useUserData();

  const { studentCourse } = useMemo(() => {
    const stCourses = data?.studentCourse || [];

    const studentCourse = stCourses.find((v) => v.studentId == userData?.id);

    return { studentCourse };
  }, [data, userData]);

  async function updateStudentCourse(d: any) {
    if (!studentCourse) return;
    await studentCourseUpdate({
      variables: {
        id: Number(studentCourse?.id),
        input: d,
      },
    });
  }

  console.log(data, "Student Course");

  return (
    <CourseAccessContext.Provider
      value={{
        activeContent,
        onContentSelect,
        data,
        activeContentData,
        updateCourse,
        updateCourseContent,
        updateStudentCourse,
        studentCourse,
      }}
    >
      {children}
    </CourseAccessContext.Provider>
  );
}

export const useCouseAccessData = () => useContext(CourseAccessContext);

export default CourseAccessProvider;
