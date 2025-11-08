import Image from "next/image";

const FeatureElement = ({ desc, heading, iconImg }: featureDataTypes) => {
  return (
    <div className="flex items-start gap-4 lg:py-[24px] md:py-[20px] py-[14px] lg:px-[21px] md:px-[18px] px-[11px]">
      <div className="w-[80px] h-[80px]">
        <Image width={1000} height={1000} src={iconImg} alt={heading} />
      </div>
      <div className="flex flex-col gap-2 w-[400px]">
        <h2 className="md:text-[24px] text-[16px] font-semibold text-title font-playfair">
          {heading}
        </h2>
        <p className="text-txt text-[16px] xl:w-[80%] w-full">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureElement;
