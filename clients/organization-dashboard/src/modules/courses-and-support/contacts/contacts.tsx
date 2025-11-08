import AdminLayout from "@/shared/components/admin-layout";
import { Input } from "@nextui-org/react";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import ContactsCard from "./elements/contacts-card";
import {Pagination} from "@nextui-org/react";

const Contacts = () => {
  return <AdminLayout>
    <div className="flex flex-col gap-5 w-full">
    <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">Contacts</h2>
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
              <Input
                classNames={{
                  base: "max-w-full  h-10",
                  mainWrapper: "h-full",
                }}
                style={{ backgroundColor: "transparent" }}
                placeholder="Search here"
                size="sm"
                startContent={<IoIosSearch size={18} />}
                type="search"
              />
            </div>
            {/* add button here */}
          </div>
          {/* cantact cards */}
          <div className="w-full grid grid-cols-3 gap-5">


           {
            [1,2,3,4,5,6].map((card,i:number)=>(
              <>
              <ContactsCard />
              </>
              
            ))
           }
          </div>
          {/* pagination */}
          <div className="flex justify-center items-center py-4 w-full">
          <Pagination total={10} initialPage={1} />
          </div>
        </div>
    </div>
  </AdminLayout>;
};

export default Contacts;
