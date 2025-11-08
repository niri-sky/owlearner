"use client";
import { useMounted } from "@/shared/hooks/use-mount";
import Image from "next/image";
import React from "react";

type ContactData = {
  id: string | number;
  profile: string;
  name: string;
  address: string;
  phone: string;
  gmail: string;
};

type Props = {
  data: ContactData;
};

const ContactsCard = ({
  data: { address, gmail, name, phone, profile },
}: Props) => {
  const isMounted = useMounted();

  if (!isMounted) return <></>;

  return (
    <div className="w-full rounded-[12px] px-6 py-8 h-full shadow-sm border border-bcolor flex  items-center justify-center text-center flex-col gap-3">
      <div className="rounded-full w-[100px] h-[100px] overflow-hidden mx-auto">
        <Image
          className="rounded-full object-cover"
          width={100}
          height={100}
          src={profile}
          alt="contact employee image"
        />
      </div>
      <div className="flex flex-col w-full gap-3">
        <h2 className="text-[18px] font-semibold text-txt">{name}</h2>
        <p className="text-sm text-txt">{address}</p>
        <a className="hover:underline text-sm text-txt" href={"tel:+" + phone}>
          {phone}
        </a>
        <a
          className="text-sm text-txt hover:underline"
          href="mailto:example@gmail.com"
        >
          {gmail}
        </a>
      </div>
    </div>
  );
};

export default ContactsCard;
