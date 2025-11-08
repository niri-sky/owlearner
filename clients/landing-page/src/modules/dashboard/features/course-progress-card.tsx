import {
  CompleteCourseIcon,
  CourseProgressIcon,
  EarningPointsIcon,
} from "@/shared/assets/icons";
import { useStudentData } from "@/shared/context/StudentDataProvider";
import React, { useMemo } from "react";

const CourseProgressCard = () => {
  const { profileData } = useStudentData();

  const {
    completedCourses,
    progressCourses,
    studentCourses,
    assignmentPoints,
    quizPoints,
  } = useMemo(() => {
    const studentCourses = profileData?.courses || [];

    const progressCourses = studentCourses.filter(
      (v) => v.status == "inprogress"
    );

    const completedCourses = studentCourses.filter(
      (v) => v.status == "completed"
    );

    let quizPoints = 0;

    let assignmentPoints = 0;

    for (const item of studentCourses) {
      const quizP = item.quiz_points.reduce(
        (prev, cur) => prev + cur.points,
        0
      );
      const assignmentP = item.assignment_points.reduce(
        (prev, cur) => prev + cur.mark,
        0
      );
      assignmentPoints += assignmentP;
      quizPoints += quizP;
    }

    return {
      completedCourses,
      progressCourses,
      studentCourses,
      quizPoints,
      assignmentPoints,
    };
  }, [profileData]);

  return (
    <div className="order-first col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:order-none lg:col-span-6 lg:gap-6">
      <Card
        title="Courses in progress"
        event={progressCourses?.length}
        icon={<CourseProgressIcon />}
      />
      <Card
        title="Completed Courses"
        event={completedCourses.length}
        icon={<CompleteCourseIcon />}
      />
      {/* <Card
        title="Total Assignment Points"
        event={assignmentPoints}
        icon={<EarningPointsIcon />}
      /> */}
      <Card
        title="Total Quiz Points"
        event={quizPoints}
        icon={<EarningPointsIcon />}
      />
    </div>
  );
};

const Card = ({ title, event, icon }: CourseProgressCardProps) => {
  return (
    <div className="bg-[white] shadow-md flex flex-col rounded-[0.5rem] relative break-words justify-between p-5">
      <p className="font-medium">{title}</p>
      <div className="flex items-center justify-between pt-4">
        <p className="text-3xl font-semibold text-slate-700 dark:text-navy-100">
          {event || 0}
        </p>
        {icon}
      </div>
    </div>
  );
};
export default CourseProgressCard;
