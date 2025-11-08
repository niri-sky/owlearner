"use client";
import AdminLayout from "@/shared/components/admin-layout";
import Image from "next/image";
import OrderAnalytics from "./elements/order-analytics";
import TeachersAnalytics from "./elements/teachers-analytics";
import SutdentsAnalytics from "./elements/sutdents-analytics";
import OrganizationsAnalytics from "./elements/organizations-analytics";
import useUserData from "@/shared/hooks/useUserData";
import { useQuery } from "@apollo/client";
import { TEACHER_EARNING } from "@/graphql/queries";

const AnalyticsTeacher = () => {
  const { userData } = useUserData();

  const { data, loading } = useQuery(TEACHER_EARNING, {
    variables: {
      teacherId: Number(userData?.id),
    },
    skip: !userData?.id,
  });

  const salesData = data?.teacherEarning?.sales || [];

  console.log(data, "Teacher Earnings");

  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-8">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Analytics
          </h2>
          <div className="absolute top-[20px] right-[19px]">
            <Image
              width={165}
              height={100}
              src={
                "https://modernize-angular-main.netlify.app/assets/images/breadcrumb/ChatBc.png"
              }
              alt="employee image"
            />
          </div>
        </div>
        {/* charts start */}
        {!loading && (
          <div className="grid grid-cols-1  gap-4">
            <OrderAnalytics sales={salesData} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyticsTeacher;
