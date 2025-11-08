"use client";
// global paikages
import React from "react";
import Image from "next/image";
import { Tabs, Tab, Card, CardBody, Button } from "@nextui-org/react";

// custom files import
import AdminLayout from "@/shared/components/admin-layout";

import CoursesInvoice from "./features/courses/courses";
import WithdrawalInvoice from "./features/withdrawal/withdrawal";
import { useQuery } from "@apollo/client";
import { INVOICES_QUERY, PAYMENT_INVOICES_QUERY } from "@/graphql/queries";

const Invoices = () => {
  const { data: invoices } = useQuery(INVOICES_QUERY);

  const coursesInvoice: InvoiceType[] = invoices?.invoices || [];

  const { data: paymentInvoicesData } = useQuery(PAYMENT_INVOICES_QUERY, {
    variables: {
      where: {
        to: {
          equals: "admin",
        },
      },
    },
  });

  const paymentInvoices = paymentInvoicesData?.paymentInvoices || [];

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
