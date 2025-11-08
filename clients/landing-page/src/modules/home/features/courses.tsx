"use client";
// swiper slide packge
import { SwiperSlide } from "swiper/react";

// custom file imports
import { Tab, Tabs } from "../elements/tab";
import SectionTitle from "@/shared/components/section-title";


import CourseItem from "@/modules/course/CourseItem";
import { useQuery } from "@apollo/client";
import { CATEGORIES_QUERY, COURSES_QUERY } from "@/graphql/queries";

const Courses = () => {
  const { data: categoriesData } = useQuery(CATEGORIES_QUERY);

  const categories: any[] = categoriesData?.categories || [];

  const { data } = useQuery(COURSES_QUERY, {
    variables: {
      where: {
        status: {
          equals: "live",
        },
      },
    },
  });

  const coursesData: CourseData[] = data?.courses || [];


  return (
    <section
      className="xl:py-[110px] lg:py-[60px] md:py-[40px] py-8 w-full bg-white"
      id="hm-course"
    >
      <div className="container">
        <div className="flex flex-col w-full xl:gap-[56px] lg:gap-[45px] gap-[30px]">
          {/* section title */}
          <SectionTitle
            title="A broad selection of courses"
            desc="Choose from over 210,000 online video courses with new additions published every month"
          />
          {/* courses */}
          <div>
            {categories.length > 0 && (
              <Tabs>
                {categories.map((v, i) => {
                  const fcData = (coursesData || []).filter(
                    (c) => c.course_category == v?.name
                  );
                  return (
                    <Tab
                      label={v?.name}
                      subCount={`${fcData.length} course${
                        fcData.length > 1 ? "s" : ""
                      }`}
                      key={"dgasdf" + i}
                    >
                      <div className="flex w-full justify-between">
                        {fcData.map((item, i) => (
                          <SwiperSlide key={i}>
                            <CourseItem data={item} />
                          </SwiperSlide>
                        ))}
                      </div>
                    </Tab>
                  );
                })}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
