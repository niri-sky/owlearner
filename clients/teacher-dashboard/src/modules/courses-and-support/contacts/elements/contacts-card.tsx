import Image from "next/image";
import React from "react";

const ContactsCard = () => {
  return (
    <div className="w-full rounded-[12px] px-6 py-8 h-full shadow-sm border border-bcolor flex  items-center justify-center text-center flex-col gap-3">
      <div className="rounded-full w-[100px] h-[100px] overflow-hidden mx-auto">
        <Image
          className="rounded-full object-cover"
          width={100}
          height={100}
          src={"https://i.pravatar.cc/150?u=a042581f4e29026024d"}
          alt="contact employee image"
        />
      </div>
      <div className="flex flex-col w-full gap-3">
        <h2 className="text-[18px] font-semibold text-txt">George Johnson</h2>
        <p className="text-sm text-txt">
          795 Folsom Ave, Suite 600 San Francisco, NY, 10003
        </p>
        <a className="hover:underline text-sm text-txt" href="tel:+8805456-789054">+8805456-789054</a>
        <a className="text-sm text-txt hover:underline" href="mailto:example@gmail.com">example@gmail.com</a>
      </div>
    </div>
  );
};

export default ContactsCard;
