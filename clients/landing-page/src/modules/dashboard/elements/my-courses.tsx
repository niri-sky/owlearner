import DashboardCourseCard from "../features/course-card";

const MyCourses = () => {
  return (
    <div className="flex flex-col gap-3 px-10">
      <h3 className="text-base font-medium text-slate-700 dark:text-slate-100 mt-3">
        My Courses
      </h3>

      <DashboardCourseCard />
    </div>
  );
};
export default MyCourses;
