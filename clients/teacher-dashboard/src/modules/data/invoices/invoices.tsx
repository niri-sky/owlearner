"use client";
// global paikages
import { Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";

// custom files import
import AdminLayout from "@/shared/components/admin-layout";

import { INVOICES_QUERY, PAYMENT_INVOICES_QUERY } from "@/graphql/queries";
import useNotifications from "@/shared/hooks/use-notifications";
import useUserData from "@/shared/hooks/useUserData";
import { useQuery } from "@apollo/client";
import CoursesInvoice from "./features/courses/courses";
import WithdrawalInvoice from "./features/withdrawal/withdrawal";

const Invoices = () => {
  const { userData } = useUserData();

  const { data } = useQuery(PAYMENT_INVOICES_QUERY, {
    variables: { where: { teacherId: { equals: Number(userData?.id) } } },
    skip: !userData?.id,
  });

  const paymentInvoices = data?.paymentInvoices || [];

  const { data: invoices } = useQuery(INVOICES_QUERY, {
    variables: {
      where: {
        courses: {
          some: {
            teacherId: {
              equals: Number(userData?.id),
            },
          },
        },
      },
    },
    skip: !userData?.id,
  });

  const coursesInvoice: InvoiceType[] = invoices?.invoices || [];

  const { createNotification } = useNotifications();

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

        {/* <Button
          onClick={() => {
            createNotification({
              variables: {
                input: {
                  text: "purchase <a>Mern stack</a> course",
                  sender: {
                    create: {
                      type: "sender",
                      userType: "student",
                      student: {
                        connect: {
                          id: 1,
                        },
                      },
                    },
                  },
                  receiver: {
                    create: {
                      type: "receiver",
                      userType: "teacher",
                      teacher: {
                        connect: {
                          id: 1,
                        },
                      },
                    },
                  },
                },
              },
            });
          }}
        >
          Click Me
        </Button> */}

        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" color="primary" size="lg">
            <Tab key="courses" title="Courses">
              <CoursesInvoice data={coursesInvoice} />
            </Tab>
            <Tab key="withdrawal" title="Withdrawal">
              <WithdrawalInvoice data={paymentInvoices} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Invoices;
