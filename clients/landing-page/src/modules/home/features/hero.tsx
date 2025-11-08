"use client";
import Image from "next/image";

// custom file imports
import { Icons } from "@/shared/utils/Icon";
import Rating from "@/shared/components/rating";
import Link from "next/link";
import HeroImage from "./hero-image";
import HeroImg from "@/shared/assets/img/hero.png";

const Hero = () => {
  return (
    <section className="w-full lg:py-[44px] py-[36px]">
      <div className="container">
        <div className="flex items-center lg:flex-row flex-col justify-between gap-[32px]">
          {/* left side */}
          <div className=" flex flex-col lg:gap-[24px] md:gap-5 gap-5">
            <div className="w-full relative z-30">
              <h1 className="xl:text-[63px] lg:text-[53px] md:text-[40px] text-[32px] text-title font-semibold xl:leading-[80px] lg:leading-[60px] md:leading-[40px] leading-[40px] font-playfair">
                Learn anything, anywhere, anytime
              </h1>
            </div>
            <div className="lg:w-[75%] w-full">
              <p className="md:text-lg text-sm text-txt leading-[26px]">
                Take control of your future with online courses that provide
                practical skills at your own schedule
              </p>
            </div>
            <div>
              <Link
                href={"/courses"}
                className="bg-primary rounded-full py-4 px-8 text-white"
              >
                Explore courses
              </Link>
            </div>
          </div>
          {/* right side */}
          <div className="w-full relative z-20">
            <div className="w-full">
              <div className="hidden md:block">
                <HeroImage />
              </div>
              <div className="block md:hidden w-full overflow-hidden">
                <Image src={HeroImg} width={400} height={600} alt="" className="w-[95%] m-auto" />
              </div>
            </div>

            {/* dream courses */}

            {/* count */}
            <div className="flex items-center gap-3 absolute bottom-[30%] lg:left-[-105px] left-0 bg-white rounded-md border md:py-3 md:px-4 p-2 xl:w-[280px] md:w-[240px] w-[150px]">
              <div>
                <span className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] rounded-full bg-[#FCE5E2] text-yColor flex justify-center items-center md:text-[25px] text-lg">
                  {Icons.business}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="text-yColor text-xs md:text-[16px]">300 +</div>
                <div className="text-txt md:text-sm text-xs">Free Courses</div>
              </div>
            </div>
            {/* rating */}
            <div className="flex items-center gap-3 absolute  md:bottom-[30%] bottom-[30%] md:right-[-15px] 2xl:right-[-40px] bg-white rounded-md border md:py-3 py-2 md:px-4 px-2 md:w-[240px] xl:w-[250px] w-[130px] right-0">
              <div className="flex flex-col">
                <div className="text-priColor">4.9 rating</div>
                <div className="text-txt text-xs overflow-hidden">
                  <Rating
                    maxStars={5}
                    initialRating={4.5}
                    isClickable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
