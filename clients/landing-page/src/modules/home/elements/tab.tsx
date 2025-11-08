import React, { useState } from "react";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export const Tab: React.FC<CoursesTabProps> = ({ children }) => (
  <Swiper
    slidesPerView={4}
    spaceBetween={30}
    pagination={{ clickable: true }}
    navigation={true}
    autoplay={{ delay: 2500 }}
    breakpoints={{
      100: { slidesPerView: 1, spaceBetween: 10 },
      640: { slidesPerView: 1, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 20 },
      992: { slidesPerView: 2, spaceBetween: 20 },
      1320: { slidesPerView: 4, spaceBetween: 30 },
    }}
    modules={[Navigation]}
    className="mySwiper xl:w-[1280px] lg:w-[992px] md:w-[768px] w-[335px] sm:w-[640px] mx-auto mt-[30px]"
    id="course"
  >
    {children}
  </Swiper>
);

export const Tabs: React.FC<CoursesTabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center xl:overflow-x-hidden overflow-x-scroll w-full xl:w-full gap-[18px] mb-4">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const tabElement = child as React.ReactElement<CoursesTabProps>;

            return (
              <div className="w-max xl:w-max">
                <button
                  className={`py-[10px] px-6 w-max xl:w-max focus:outline-none flex flex-col rounded-full ${
                    activeTab === index
                      ? "bg-primary text-white"
                      : "bg-[#FAEAFA]"
                  }`}
                  onClick={() => handleTabClick(index)}
                >
                  <span className="xl:text-lg font-bold">
                    {tabElement.props.label}
                  </span>
                  <span className="text-sm">{tabElement.props.subCount}</span>
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div>{React.Children.toArray(children)[activeTab]}</div>
    </div>
  );
};
