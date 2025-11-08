import Image from "next/image";
import PhoneIcon from "@/shared/assets/svg/contact-phone.svg";

const ContactUsElement = ({ Icon, desc, title }: contactUsDataTypes) => {
  return (
    <div className="flex flex-col lg:gap-4 md:gap-3 gap-3 lg:px-[32px] md:px-[22px] lg:py-[35px] md:py-[25px] py-4 px-3 rounded-sm w-full bg-primary text-white">
      <div>
        <Image
          className="lg:h-[44px] lg:w-[43px] w-[33px] h-[34px] "
          src={Icon}
          alt={title}
        />
      </div>
      <div className="lg:text-lg text-[16px] font-bold">{title}</div>
      <div>
        <p className="text-[16px]">{desc}</p>
      </div>
    </div>
  );
};

export default ContactUsElement;
