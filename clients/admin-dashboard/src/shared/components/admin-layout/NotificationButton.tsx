import React, { useMemo } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useOutsideClick } from "outsideclick-react";
import { useDisclosure } from "@nextui-org/react";
import useNotifications from "@/shared/hooks/use-notifications";

function NotificationButton() {
  const { isOpen, onOpenChange, onClose } = useDisclosure();

  const { notifications } = useNotifications();

  const { notViewedLength } = useMemo(() => {
    const notViewedLength = notifications.filter((v) => !v.isViewed).length;
    return { notViewedLength };
  }, [notifications]);

  const ref = useOutsideClick(onClose);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onOpenChange}
        className="relative inline-flex justify-center items-center h-[40px] w-[40px] text-sm font-semibold rounded-lg md:border border-[#e5e7eb] bg-[#fff] text-[#1f2937]  hover:bg-[#f9fafb] disabled:opacity-50 disabled:pointer-events-none dark:bg-[#0f172a] dark:border-[#374151] dark:text-[#fff] dark:hover:bg-[#1f2937] dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-[#4b5563]"
      >
        <svg
          className="flex-shrink-0 w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <span className="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-[#ef4444] text-[#fff]">
          {notViewedLength > 99 ? "99+" : notViewedLength}
        </span>
      </button>

      <div>{isOpen && <NotificationDropdown data={notifications} />}</div>
    </div>
  );
}

export default NotificationButton;
