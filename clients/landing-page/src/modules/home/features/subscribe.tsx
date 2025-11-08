import Image from "next/image";
// images
import Shape_1 from "@/shared/assets/img/shape-1.png";
import Shape_2 from "@/shared/assets/img/shape-2.png";
import SectionTitle from "@/shared/components/section-title";

const Subscribe = () => {
  return (
    <section className=" w-full bg-[#D1BCE3] relative">
      <div className="absolute left-0 bottom-0">
        <Image
          className="xl:h-[410px] lg:h-[280px] w-[207px] h-[167px] lg:w-full"
          width={412}
          height={510}
          src={Shape_1}
          alt="Shape image"
        />
      </div>
      <div className="container">
        <div className="lg:h-[479px] h-[734px] flex flex-col justify-center items-center xl:w-[80%] lg:w-[90%] w-full mx-auto relative z-[20]">
          <div className="pb-4">
            <span className="text-[18px] capitalize font-[500] text-txt">
              go at your own page
            </span>
          </div>
          <SectionTitle
            title="subscribe to our newsletter"
            desc="Subscribe to stay updated with the latest features or changes"
          />
          <div className="flex items-center xl:mt-[48px] lg:mt-[35px] mt-6 xl:w-[60%] md:w-[60%] w-full relative">
            <input
              className="w-full outline-none border border-primary rounded-full text-[#605F5F] lg:py-[18px] md:py-[15px] py-[12px] lg:pl-[30px] md:pl-[25px] pl-[15px] lg:pr-[218px] md:pr-[184px] pr-[132px] bg-[#D1BCE3]"
              type="text"
              name=""
              id=""
              placeholder="Enter your email"
            />
            <div className="absolute right-0 top-[1px] z-40">
              <button className="bg-primary hover:bg-[#df13e2] rounded-full border-none outline-none text-white lg:py-[20px] md:py-[17px] py-[14px] lg:px-[48px] md:px-[30px] px-[12px] md:text-[16px] text-sm">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 lg:bottom-0 top-0 xl:top-[unset]">
        <Image
          className="xl:h-[430px] w-[170px] h-[167px] lg:w-full lg:h-[280px]"
          width={412}
          height={510}
          src={Shape_2}
          alt="Shape image"
        />
      </div>
    </section>
  );
};

export default Subscribe;
