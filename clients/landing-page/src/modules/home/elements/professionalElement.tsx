import Image from "next/image";

const ProfessionalElement = ({
  desc,
  heading,
  iconImg,
}: professionalDataTypes) => {
  return (
    <div className="flex flex-col justify-center items-center text-center md:gap-4 gap-[5px]">
      <div>
        <Image
          width={60}
          height={60}
          className="md:w-[40px] md:h-[40px] lg:w-[60px] lg:h-[60px] w-[20px] h-[20px] "
          src={iconImg}
          alt={heading}
        />
      </div>
      <div>
        <h3 className="lg:text-[24px] md:text-[18px] text-[10px] font-semibold text-white">
          {heading}
        </h3>
      </div>
      <div>
        <p className="md:text-[16px] text-[8px] text-[#fcfcfc]">{desc}</p>
      </div>
    </div>
  );
};

export default ProfessionalElement;
