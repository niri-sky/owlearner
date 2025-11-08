"use client";
import AdminLayout from "@/shared/components/admin-layout";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import ContactsCard from "./elements/contacts-card";
import { Pagination, PaginationItem } from "@nextui-org/react";

import { faker } from "@faker-js/faker";
import { SearchBar, useSearchBar } from "@/shared/hooks/use-search-bar";
import { useMemo } from "react";

const fakeContactsData = [...Array(45)].map((_, i) => ({
  id: i + 1,
  profile: faker.image.avatar(),
  name: faker.person.fullName(),
  address: `${faker.location.streetAddress(
    true
  )} ${faker.location.city()} ${faker.location.state({
    abbreviated: true,
  })} ${faker.location.zipCode()}`,
  gmail: faker.internet.email(),
  phone: faker.phone.number(),
}));

const Contacts = () => {
  const { filterData: data, searchProps } = useSearchBar(fakeContactsData);

  const { totalPage, filterData } = useMemo(() => {
    const totalPage = Math.ceil(data.length / 10);

    const filterData = data;
    return { totalPage, filterData };
  }, [data]);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 w-full">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Contacts
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
        <div className="flex flex-col gap-4 w-full p-3 rounded-[14px] shadow-xl border border-bcolor">
          <div className="w-full flex bg-[#ebebeb] py-[15px] px-[10px] rounded-[10px] justify-start items-start gap-5">
            <div className="mb-[8px]">
              <SearchBar {...searchProps} />
            </div>
            {/* add button here */}
          </div>
          {/* cantact cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filterData.map((card, i: number) => (
              <ContactsCard key={"dga" + i} data={card} />
            ))}
          </div>
          {/* pagination */}
          <div className="flex justify-center items-center py-4 w-full">
            <Pagination
              onChange={(e) => {
                console.log(e);
              }}
              total={totalPage}
              initialPage={1}
              showControls
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Contacts;
