import { CREATE_NOTIFICATION } from "@/graphql/queries";
import { useMutation } from "@apollo/client";
import React from "react";

type UserType = "admin" | "student" | "organization" | "teacher";

type PropsType = {
  sender: { type: UserType; id: string | number | undefined };

  receiver: { type: UserType; id: string | number | undefined };

  text: string;
  link: string;
};

function useCreateNotification() {
  const [create] = useMutation(CREATE_NOTIFICATION);

  function createNotification(props: PropsType) {
    const generateObj = {
      ...props,
      receiver: {
        create: {
          type: "receiver",
          userType: props.receiver.type,
          [props.receiver.type]: {
            connect: {
              id: Number(props.receiver.id),
            },
          },
        },
      },
      sender: {
        create: {
          type: "sender",
          userType: props.sender.type,
          [props.sender.type]: {
            connect: {
              id: Number(props.sender.id),
            },
          },
        },
      },
    };

    return create({
      variables: {
        input: generateObj,
      },
    });
  }

  return { createNotification };
}

export default useCreateNotification;
