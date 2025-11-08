// global packages
import Image from "next/image";
// custom files import
import AdminLayout from "@/shared/components/admin-layout";
import { Button } from "@nextui-org/react";
import UploadProfileImage from "./UploadProfileImage";

const AccountSettings = () => {
  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-5">
        <div className="w-full flex justify-between gap-5 items-center border border-bcolor px-4 py-10 relative overflow-hidden rounded-[12px] bg-[#ECF2FF]">
          <h2 className="text-xl font-semibold text-txt capitalize">
            Account Setting
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
        {/* form start */}
        <form className="flex gap-5 w-full flex-col justify-between">
          <div className="flex flex-col lg:flex-row gap-5 w-full justify-between">
            {/* left side */}
            <div className="w-full shadow-sm border border-bcolor p-3 rounded-[12px] flex flex-col gap-5 self-start">
              <div className="w-full flex flex-col pb-4 px-2">
                <h2 className="text-[18px] font-semibold text-txt">
                  Change Profile
                </h2>
                <p className="text-txt text-sm">
                  Change your profile picture from here
                </p>
              </div>
              <UploadProfileImage />
              <div className="w-full text-center pb-1">
                <p className="text-txt text-sm">
                  Allowed JPG, GIF or PNG. Max size of 800K
                </p>
              </div>
            </div>
            {/* right side */}
            <div className="w-full flex flex-col gap-5">
              {/* input name and email fields */}
              <div className="w-full shadow-sm border border-bcolor pt-[12px] pb-[22px] px-5 rounded-[12px] flex flex-col gap-4">
                <div className="w-full flex flex-col pb-2 px-2">
                  <h2 className="text-[18px] font-semibold text-txt">
                    Personal Details
                  </h2>
                  <p className="text-txt text-sm">
                    To change your personal detail , edit and save from here
                  </p>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    Your Name
                  </label>
                  <input
                    className="md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]"
                    type="text"
                    placeholder="Name"
                    name="name"
                    id=""
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    Email
                  </label>
                  <input
                    className="md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]"
                    type="email"
                    placeholder="Email"
                    name="email"
                    id=""
                  />
                </div>
              </div>
              {/* input Password fields */}
              <div className="w-full shadow-sm border border-bcolor pt-[12px] pb-[22px] px-5 rounded-[12px] flex flex-col gap-4">
                <div className="w-full flex flex-col pb-2 px-2">
                  <h2 className="text-[18px] font-semibold text-txt">
                    Change Password
                  </h2>
                  <p className="text-txt text-sm">
                    To change your password please confirm here
                  </p>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    Current Password
                  </label>
                  <input
                    className="md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]"
                    type="password"
                    placeholder="Current Password"
                    name="currentPassword"
                    id=""
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    New Password
                  </label>
                  <input
                    className="md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]"
                    type="password"
                    placeholder="New Password"
                    name="newPassword"
                    id=""
                  />
                </div>
                <div className="flex flex-col w-full gap-2">
                  <label
                    className="text-[#2a3547] text-sm font-semibold"
                    htmlFor=""
                  >
                    Confirm Password
                  </label>
                  <input
                    className="md:py-4 py-3 px-3 border-1 border-[#e0e0e0] rounded-md outline-[#dcdcdc] outline-1 hover:border-[black] text-[16px] w-full text-[#000000de]"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    id=""
                  />
                </div>
              </div>
            </div>
          </div>
          {/* save and cancel buttons */}
          <div className="flex gap-3 w-full justify-end items-center pb-4">
            <Button color="primary" type="submit">
              Save
            </Button>

            <Button color="danger" variant="bordered">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AccountSettings;
