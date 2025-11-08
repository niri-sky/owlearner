import { isOpen } from "@/app/configs/constants";
import { useAtom } from "jotai";

const useModalOpen = () => {
  const [open, setOpen] = useAtom(isOpen);
  return { open, setOpen };
};
export default useModalOpen;
