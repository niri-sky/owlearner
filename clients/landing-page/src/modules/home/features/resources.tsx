"use client";
import Image from "next/image";
import Link from "next/link";

// swiper slide packages
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
// swiper slider css files
import "swiper/css";
import "swiper/css/pagination";
// custom file imports
import SectionTitle from "@/shared/components/section-title";
import { resourcesData } from "@/app/configs/constants";

const Resources = () => {
  return (
    <section className="xl:py-[110px] lg:py-[60px] md:py-[40px] py-8 w-full bg-[#EBEEE4]">
      <div className="container">
        <div className="w-full flex flex-col lg:gap-[56px] md:gap-[40px] gap-6">
          <SectionTitle
            title="Our latest news"
            desc="Read what is happening at Owl Learner"
          />
          {/* slider */}
          <div>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 2500,
              }}
              breakpoints={{
                100: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              modules={[Pagination]}
              className="mySwiper resources"
            >
              {resourcesData.map(
                (
                  {
                    comments,
                    dates,
                    heading,
                    slideImg,
                    title,
                  }: resourcesDataTypes,
                  i: number
                ) => (
                  <SwiperSlide key={i}>
                    <div className="flex flex-col w-full gap-4">
                      <div>
                        <Image
                          className="sm:h-[234px] w-full h-full rounded-[12px]"
                          height={234}
                          width={312}
                          src={slideImg}
                          alt={heading}
                        />
                      </div>
                      <div className="flex flex-col gap">
                        <div className="text-[16px] font-semibold text-title">
                          {title}
                        </div>
                        <div>
                          <Link
                            className="lg:text-[24px] text-[20px]  font-semibold hover:text-primary hover:underline text-title font-playfair"
                            href="/"
                          >
                            {heading}
                          </Link>
                        </div>
                      </div>
                      <ul className="flex items-center gap-[8px]">
                        <li>
                          <p className="text-[14px] text-txt">{dates}</p>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="w-[3px] h-[3px] rounded-full bg-slate-500"></span>
                          <p className="text-[14px] text-txt">{comments}</p>
                        </li>
                      </ul>
                    </div>
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;
