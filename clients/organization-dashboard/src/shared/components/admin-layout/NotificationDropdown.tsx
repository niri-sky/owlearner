import React from "react";
import Image from "next/image";
import useNotifications, {
  NotificationData,
} from "@/shared/hooks/use-notifications";
import Moment from "react-moment";
import { cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type Props = {
  data: NotificationData[];
};

function NotificationDropdown({ data }: Props) {
  return (
    <div>
      <div className="fixed md:absolute w-full sidebar-scrollbar max-h-[400px] overflow-y-auto md:w-[20rem] right-0 bg-white border rounded-md shadow-2xl overflow-hidden z-20">
        <div className="">
          {data.length > 0 ? (
            data.map((v, i) => <NotificationItem key={"sgd" + i} d={v} />)
          ) : (
            <div>
              <div className="text-sm text-red-400 p-4">
                No notification found
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type ItemProps = {
  d: NotificationData;
};

function NotificationItem({ d }: ItemProps) {
  const senderData = (d?.sender as any)?.[d?.sender?.userType];

  const { updateNotification } = useNotifications();
  const router = useRouter();

  return (
    <div>
      <div
        className={cn(
          "flex items-center px-2 py-3 border-b  ",
          d.isViewed
            ? "bg-white"
            : "bg-gray-100 hover:bg-primary-50 cursor-pointer"
        )}
        onClick={() => {
          if (!d.isViewed) {
            updateNotification({
              variables: {
                id: Number(d.id),
                input: {
                  isViewed: true,
                },
              },
            });
            router.push(d.link || "/");
          }
        }}
      >
        <Image
          className="h-8 w-8 rounded-full object-cover mx-1"
          src={senderData?.profile || "/user-1.jpg"}
          alt="avatar"
          width={32}
          height={32}
        />
        <div>
          <p className="text-gray-600 w-[calc(100%-40px)] text-sm mx-2 line-clamp-2">
            <span className="font-bold">{senderData?.name}</span>{" "}
            <span dangerouslySetInnerHTML={{ __html: d?.text }}></span>
          </p>
          <div className="text-xs mt-1 mx-2">
            <Moment date={d.createdAt} fromNow />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDropdown;
