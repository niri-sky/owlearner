"use client";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";

// global packages
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { MdMenu, MdDelete } from "react-icons/md";

// custom files import
import AdminLayout from "@/shared/components/admin-layout";

const Todo = () => {
  const [expand, setExpand] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <AdminLayout>
      <div className="flex flex-col w-full gap-5">
        {/* top page name and image */}
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">Todos</h2>
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
        {/* todos area start */}
        <div className="flex w-full justify-between  shadow-sm border border-bcolor rounded-[12px] border-l">
          {/* todos edit right side */}
          <div className="flex flex-col gap-5 w-full order-2">
            <div className="w-full flex justify-between items-center py-4 border-b px-6 border-r border-bcolor">
              <div className="w-full">
                <span
                  onClick={() => setExpand(!expand)}
                  className="text-[25px] cursor-pointer"
                >
                  <MdMenu />
                </span>
              </div>
              <div className="">
                <Button
                  onPress={onOpen}
                  color="primary"
                  endContent={<AiOutlinePlus />}
                >
                  Add Todo
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-5 pt-2 pb-6 px-6">
              <div className="w-full">
                <h2 className="text-[18px] text-txt font-semibold capitalize">
                  Edit Todo
                </h2>
              </div>
              <div className="w-full">
                <input
                  placeholder="Todo title"
                  className="md:py-4 py-3 pl-3 pr-[40px] border border-[#e0e0e0] rounded-md outline-[#dcdcdc] hover:border-[black] text-[#000000de] w-full"
                  name=""
                  id=""
                />
              </div>
              <div className="w-full">
                <textarea
                  placeholder="Write here..."
                  className="p-[30px] h-[207px] w-full border border-bcolor rounded-md outline-[#dcdcdc] hover:border-[black] text-[#000000de]"
                  name=""
                  id=""
                ></textarea>
              </div>
            </div>
          </div>
          {/* todos left side */}
          <div
            className={`h-[354px] overflow-y-scroll px-6 py-4 flex-col gap-3 order-1 ${
              expand ? " w-0 hidden" : "w-[400px] flex"
            }`}
          >
            <div className="mb-[8px]">
              <Input
                classNames={{
                  base: "max-w-full  h-10",
                  mainWrapper: "h-full",
                }}
                style={{ backgroundColor: "transparent" }}
                placeholder="Search here"
                size="sm"
                endContent={<IoIosSearch size={18} />}
                type="search"
              />
            </div>
            <div className="w-full pt-2">
              <h2 className="text-[18px] text-txt font-semibold capitalize">
                All Todos
              </h2>
            </div>
            {/*  */}
            <div className="flex flex-col w-full gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((todo, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center gap-3 w-full !py-3 !px-3 rounded-md cursor-pointer first:bg-[#ECF2FF]"
                >
                  <div className="flex flex-col overflow-hidden w-full">
                    <h2
                      className="text-[15px] text-txt font-semibold truncate "
                      title=" this is New notes this is New notes"
                    >
                      this is New notes this is New notes
                    </h2>
                    <p className="text-sm text-txt">Dec 18, 2023</p>
                  </div>
                  <div>
                    <span className="text-lg text-[#505050] hover:text-txt">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-center items-center justify-center text-[24px] font-semibold text-txt capitalize gap-1">
                Create Todo
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-col gap-3">
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="">Todo title</label>
                    <input
                      className="md:py-4 py-3 pl-3 pr-[40px] border border-[#e0e0e0] rounded-md outline-[#dcdcdc] hover:border-[black] text-[#000000de] w-full"
                      type="text"
                      name=""
                      id=""
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="">Todo details</label>
                    <textarea
                      placeholder="Write here..."
                      className="py-3 px-2 border
                     border-bcolor
                     outline-[#dcdcdc] hover:border-[black] text-[#000000de] rounded-md h-[150px]"
                      name=""
                      id=""
                    ></textarea>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
};

export default Todo;
