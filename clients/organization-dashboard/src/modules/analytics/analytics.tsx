"use client";
import AdminLayout from "@/shared/components/admin-layout";
import Image from "next/image";
import OrderAnalytics from "./elements/order-analytics";
import TeachersAnalytics from "./elements/teachers-analytics";
import SutdentsAnalytics from "./elements/sutdents-analytics";
import OrganizationsAnalytics from "./elements/organizations-analytics";
import { ORGANIZATION_EARNING } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import useUserData from "@/shared/hooks/useUserData";
import { useMemo } from "react";

const AnalyticsOrganizations = () => {
  const { userData } = useUserData();

  const { data } = useQuery(ORGANIZATION_EARNING, {
    variables: {
      organizationId: Number(userData?.id),
    },
    skip: !userData?.id,
  });

  const { salesData } = useMemo(() => {
    const organizationEarning = data?.organizationEarning;

    const teacherEarnings: AnalyticsTeacherEarning[] =
      organizationEarning?.teacherEarnings || [];

    const salesData = teacherEarnings.flatMap((v) => v.sales) || [];

    return { salesData };
  }, [data]);

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
        <div className="grid grid-cols-1  gap-4">
          <OrderAnalytics sales={salesData} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsOrganizations;
