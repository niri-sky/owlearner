import Image from "next/image";

// brand images
import Brand_1 from "@/shared/assets/img/brand-1.png";
import Brand_2 from "@/shared/assets/img/brand-2.png";
import Brand_3 from "@/shared/assets/img/brand-3.png";
import Brand_4 from "@/shared/assets/img/brand-4.png";

const Brands = () => {
  return (
    <section className="xl:py-[110px] lg:py-[60px] md:py-[40px] py-8 w-full bg-[#F5F3EF]">
      <div className="container">
        <div className="w-full flex lg:flex-row flex-col lg:items-center items-start gap-5 justify-between">
          <div className="text-[24px] md:w-[40%] w-full font-semibold text-title font-playfair capitalize">
            owl learner is trusted by <br /> brands including
          </div>
          <ul className="grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 w-full items-center md:gap-5 gap-6">
            <li>
              <Image width={160} height={61} src={Brand_1} alt="Shapy logo" />
            </li>
            <li className="flex md:block justify-end items-end md:justify-[unset] md:items-[unset]">
              <Image width={160} height={61} src={Brand_2} alt="DotLor logo" />
            </li>
            <li>
              <Image width={160} height={61} src={Brand_3} alt="Read logo" />
            </li>
            <li className="flex md:block justify-end items-end md:justify-[unset] md:items-[unset]">
              <Image width={160} height={61} src={Brand_4} alt="Motion logo" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Brands;
