import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useAtom } from "jotai";
import { MobileSidebarState } from "@/shared/utils/state";
import NotificationButton from "./NotificationButton";

function HeaderSection() {
  const [isMobileSidebar, setMobileSidebar] = useAtom(MobileSidebarState);
  return (
    <div className="md:hidden">
      <div className="h-[65px] absolute top-0 left-0 w-full z-[18] flex items-center justify-between bg-[#fff] shadow-md pl-5 pr-4">
        <div className="font-bold text-[24px] text-primary ">Logo</div>
        <div className="flex items-center gap-4">
          <NotificationButton />
          <div
            onClick={() => setMobileSidebar(!isMobileSidebar)}
            className="p-1 cursor-pointer"
          >
            <MenuIcon />
          </div>
        </div>
      </div>
      <div className="pt-[65px]"></div>
      {isMobileSidebar && (
        <div
          onClick={() => {
            setMobileSidebar(false);
          }}
          className="w-screen md:hidden h-screen top-0 left-0 fixed z-[19] bg-[rgba(0,0,0,.2)] "
        ></div>
      )}
    </div>
  );
}

export default HeaderSection;
