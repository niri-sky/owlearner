"use client";
import Image from "next/image";
// swiper package
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
// swiper slide css files
import "swiper/css";
import "swiper/css/navigation";
// custom file imports
import SectionTitle from "@/shared/components/section-title";
import Rating from "@/shared/components/rating";
// image and icon
import QueteIcon from "@/shared/assets/svg/quete.svg";
import { studenReviewsData } from "@/app/configs/constants";

const Reviews = () => {
  const handleRatingChange = (newRating: number) => {
    // You can perform additional actions based on the new rating
  };
  return (
    <section className="xl:py-[110px] lg:py-[60px] md:py-[40px] py-8 w-full bg-white">
      <div className="container">
        <div className="w-full flex flex-col lg:gap-[56px] md:gap-[40px] gap-8">
          <SectionTitle
            title="Student Reviews"
            desc="We make sure you have a fine distance with the sickness. We make you never lose hope."
            txtColor="#757474"
          />
          {/* slider */}
          <div>
            <Swiper
              slidesPerView={1}
              // autoplay={{
              //   delay: 2500,

              // }}
              navigation={true}
              modules={[Navigation, Autoplay]}
              className="mySwiper"
            >
              {studenReviewsData?.map((item: StudentReviewsDataTypes, i) => (
                <SwiperSlide key={i}>
                  <div className="flex justify-center w-full lg:h-[600px] items-center xl:gap-6 md:gap-[6rem] gap-[60px] lg:flex-row flex-col">
                    <div className="lg:w-[50%] lg:order-1 order-2 w-full">
                      <div className="sm:w-[428px] w-[250px] h-[290px] mx-auto z-20 relative sm:h-[500px] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-[#0B72FF] after:-z-10 after:rounded-[12px]">
                        <div className="absolute sm:-top-[34px] -top-[28px] -right-[28px] !w-[420px] !h-[500px] rounded-[12px] overflow-hidden">
                          <Image
                            className="!w-full !h-full object-cover"
                            width={1000}
                            height={1000}
                            src={item?.image}
                            alt="Review Image"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-[50%] lg:order-2 order-1 w-full">
                      <div>
                        <Image
                          className="sm:h-[30px] h-[22px]"
                          src={QueteIcon}
                          alt="Icon"
                        />
                      </div>
                      <div className="sm:mt-[27px] my-4 xl:w-[79%] w-full sm:mb-[42px]">
                        <p className="md:text-lg text-sm text-[#797979]">
                          {item?.reviews}
                        </p>
                      </div>
                      <div className="text-txt overflow-hidden">
                        <Rating
                          maxStars={5}
                          initialRating={item?.rating}
                          onRatingChange={handleRatingChange}
                          isClickable={false}
                          iconSize="review"
                        />
                      </div>
                      <div className="sm:mt-4 sm:mb-[20px] my-[5px]">
                        <h2 className="md:text-[24px] text-[20px] text-title font-playfair font-semibold capitalize">
                          {item?.name}
                        </h2>
                      </div>
                      <div>
                        <h3 className="text-txt">{item?.designation}</h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
