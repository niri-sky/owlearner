import { sidebarActive } from "@/app/configs/constants";
import { useAtom } from "jotai";

const useSidebarActive = () => {
  const [isSidebarActive, setToggleSidebar] = useAtom(sidebarActive);
  return { isSidebarActive, setToggleSidebar };
};
export default useSidebarActive;
