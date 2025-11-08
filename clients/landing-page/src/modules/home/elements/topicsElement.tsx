import Image from "next/image";

const TopicsElement = ({
  backgroundColor,
  desc,
  title,
  topicIcon,
}: topicDataTypes) => {
  return (
    <div className=" flex flex-col bg-white lg:px-[28px] px-[20px] lg:py-[36px] md:py-[26px] py-[10px] rounded-[12px] w-full xl:h-[282px] md:h-[270px] h-[170px]">
      <div>
        <Image
          className="lg:w-[56px] lg:h-[56px] md:w-[45px] w-[35px] h-[35px] md:h-[45px] flex justify-center items-center  rounded-full object-scale-down"
          style={{ backgroundColor: `${backgroundColor}` }}
          width={56}
          height={56}
          src={topicIcon}
          alt="Mobile icon"
        />
      </div>
      <div className="md:pt-6 md:pb-4 pt-[12px] pb-[10px]">
        <h2 className="md:text-[24px] text-[16px] font-semibold text-title font-playfair">
          {title}
        </h2>
      </div>
      <div>
        <p className="text-txt md:text-[16px] text-[10px] w-full">{desc}</p>
      </div>
    </div>
  );
};

export default TopicsElement;
