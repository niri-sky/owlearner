import {
  CREATE_NOTIFICATION,
  NOTIFICATIONS_QUERY,
  NOTIFICATIONS_SUBSCRIPTION,
  UPDATE_NOTIFICATION,
} from "@/graphql/queries";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import useUserData from "./useUserData";

interface Admin {
  id: string;
  name: string;
  email: string;
  profile: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  profile: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  profile: string;
}

interface Organization {
  id: string;
  name: string;
  email: string;
  profile: string;
}

interface Sender {
  id: string;
  userType: string;
  type: string;
  admin?: Admin;
  student?: Student;
  teacher?: Teacher;
  organization?: Organization;
}

interface Receiver {
  id: string;
  userType: string;
  type: string;
  admin?: Admin;
  student?: Student;
  teacher?: Teacher;
  organization?: Organization;
}

export interface NotificationData {
  id: string;
  text: string;
  createdAt: Date;
  link: string;
  isViewed: string;
  sender: Sender;
  receiver: Receiver;
}

function useNotifications() {
  const { userData } = useUserData();

  const { data, refetch } = useQuery(NOTIFICATIONS_QUERY, {
    skip: !userData?.id,
    variables: {
      where: {
        receiver: {
          is: {
            teacherId: {
              equals: Number(userData?.id),
            },
          },
        },
      },
    },
  });

  useSubscription(NOTIFICATIONS_SUBSCRIPTION, {
    variables: {
      where: {
        receiverUserId: Number(userData?.id),
        receiverUserType: "teacher",
      },
    },
    skip: !userData?.id,

    onData({ data }) {
      console.log("Fire on data");
      refetch();
    },
  });

  const [createNotification] = useMutation(CREATE_NOTIFICATION);

  const [updateNotification] = useMutation(UPDATE_NOTIFICATION, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: NOTIFICATIONS_QUERY,
        variables: {
          where: {
            receiver: {
              is: {
                teacherId: {
                  equals: Number(userData?.id),
                },
              },
            },
          },
        },
      },
    ],
  });

  const notifications: NotificationData[] = data?.notifications || [];

  return {
    notifications,
    createNotification,
    updateNotification,
  };
}

export default useNotifications;
