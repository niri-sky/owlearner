"use client";
// global paikages
import { Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";

// custom files import
import { INVOICES_QUERY, PAYMENT_INVOICES_QUERY } from "@/graphql/queries";
import AdminLayout from "@/shared/components/admin-layout";
import useUserData from "@/shared/hooks/useUserData";
import { useQuery } from "@apollo/client";
import CoursesInvoice from "./features/courses/courses";
import TeachersInvoice from "./features/teachers/teachers";
import WithdrawalInvoice from "./features/withdrawal/withdrawal";

const Invoices = () => {
  const { userData } = useUserData();

  const { data: paymentInvoicesData } = useQuery(PAYMENT_INVOICES_QUERY, {
    variables: {
      where: {
        organizationId: { equals: Number(userData?.id) },
        to: {
          equals: "admin",
        },
      },
    },
  });
  const { data: teacherWithdrawRequest } = useQuery(PAYMENT_INVOICES_QUERY, {
    variables: {
      where: {
        organizationId: { equals: Number(userData?.id) },
        to: {
          equals: "organization",
        },
      },
    },
  });

  const paymentInvoices = paymentInvoicesData?.paymentInvoices || [];
  const teacherInvoices = teacherWithdrawRequest?.paymentInvoices || [];

  const { data: invoices } = useQuery(INVOICES_QUERY, {
    variables: {
      where: {
        courses: {
          some: {
            teacher: {
              is: {
                organizationId: {
                  equals: Number(userData?.id),
                },
              },
            },
          },
        },
      },
    },
    skip: !userData?.id,
  });

  const coursesInvoices: InvoiceType[] = invoices?.invoices || [];

  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Invoices
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
            <Tab key="courses" title="Courses">
              {/* <Card>
                <CardBody> */}
              {/* organizations tab table */}
              <CoursesInvoice data={coursesInvoices} />
              {/* </CardBody>
              </Card> */}
            </Tab>
            <Tab key="teachers" title="Teachers">
              {/* <Card>
                <CardBody> */}
              {/* students tab table */}
              <TeachersInvoice data={teacherInvoices} />
              {/* </CardBody>
              </Card> */}
            </Tab>
            <Tab key="withdraw" title="Withdrawal">
              {/* <Card>
                <CardBody> */}
              {/* students tab table */}
              <WithdrawalInvoice data={paymentInvoices} />
              {/* </CardBody>
              </Card> */}
            </Tab>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Invoices;
