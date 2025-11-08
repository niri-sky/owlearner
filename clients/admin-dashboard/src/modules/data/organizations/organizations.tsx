// global paikages
import React, { useMemo } from "react";
import Image from "next/image";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

// custom files import
import AdminLayout from "@/shared/components/admin-layout";
import OrganizationTable from "./OrganizationTable";
import { useQuery } from "@apollo/client";
import { ORGANIZATIONS_QUERY } from "@/graphql/queries";

const Organizations = () => {
  const { data } = useQuery(ORGANIZATIONS_QUERY);

  const { activeData, pendingData } = useMemo(() => {
    const organizatios: OrganizationTypes[] = data?.organizations || [];

    const activeData = organizatios.filter((v) => v.status === "active");
    const pendingData = organizatios.filter((v) => v.status === "pending");

    return { activeData, pendingData };
  }, [data]);

  console.log(data);
  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Organization
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
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" color="primary" size="lg">
            <Tab key="active" title="Active">
              <Card>
                <CardBody>
                  {/* active tab table */}
                  <OrganizationTable type="active" data={activeData} />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="pending" title="Pending">
              <Card>
                <CardBody>
                  {/* pending tab table */}
                  <OrganizationTable type="pending" data={pendingData} />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Organizations;
