"use client";
import React, { useMemo } from "react";
import TopInfo from "./elements/top-info";
import QuizReportSummary from "./elements/quiz-report-summary";
import AssignmentReportSummary from "./elements/assignment-report-summary";
import LeaderBoard from "./elements/leader-board";
import { useStudentData } from "@/shared/context/StudentDataProvider";
import { useParams, useRouter } from "next/navigation";
/* -------------------------------------------------------------------------- */
/*                              course dashboard                              */
/* -------------------------------------------------------------------------- */
const CourseDashboard = () => {
  const { profileData } = useStudentData();

  const params = useParams();
  const router = useRouter();
  const slug = params.courseid as string;

  console.log(params);
  const currentCourse = useMemo(() => {
    const courses = profileData?.courses || [];
    const currentCourse = courses.find((v) => v.course.slug === slug);

    return currentCourse;
  }, [slug, profileData?.courses]);

  console.log(currentCourse, profileData);

  const {
    quizReportSummary,
    assginmentReportSummary,
    leaderboardData,
    ownLeaderBoard,
    studentCourses,
  } = useMemo(() => {
    const studentCourses = currentCourse?.course?.studentCourse || [];

    const totalQuizzes =
      currentCourse?.course?.section?.flatMap((v) =>
        v?.content?.map((c) => c?.quizzes).filter((cc) => cc.length)
      ) || [];

    const quiz_points = currentCourse?.quiz_points || [];

    const totalNumber = quiz_points.reduce((a, b) => b.points + a, 0);

    const totalQuestion = totalQuizzes.flatMap((q) => q);

    let leaderboardData = studentCourses
      .map((v, i) => ({
        ...v.student,
        quiz_points: v.quiz_points.reduce((a, b) => b.points + a, 0),
      }))
      .sort((a, b) => b.quiz_points - a.quiz_points);

    console.log(leaderboardData, "Leaderboard data");

    leaderboardData = leaderboardData.map((vv, j) => ({ ...vv, rank: j + 1 }));

    const ownLeaderBoard = leaderboardData.find(
      (v) => v?.id == profileData?.id
    );

    const quizReportSummary = {
      totalQuiz: totalQuizzes.length,
      perticipate: quiz_points.length,
      totalQues: totalQuestion.length,
      numberObtained: totalNumber,
    };

    const assginmentReportSummary = {};

    return {
      ownLeaderBoard,
      quizReportSummary,
      assginmentReportSummary,
      leaderboardData,
      studentCourses,
    };
  }, [currentCourse, profileData?.id]);

  return (
    <div className="flex flex-col space-y-5 lg:space-y-8 w-full h-full px-16 py-10 bg-[#F8FAFC] container">
      <TopInfo slug={slug} />
      <div className="grid md:grid-cols-2 gap-4">
        <QuizReportSummary data={quizReportSummary} />
        {/* <AssignmentReportSummary data={assginmentReportSummary} /> */}
      </div>
      <LeaderBoard
        ownLeaderBoard={ownLeaderBoard}
        data={leaderboardData}
        title={currentCourse?.course.title || ""}
      />
    </div>
  );
};
export default CourseDashboard;
