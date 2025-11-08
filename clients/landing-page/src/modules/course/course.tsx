"use client";
import { COURSES_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useMemo, useReducer } from "react";
import CourseItem from "./CourseItem";
import FilterSidebar from "./FilterSidebar";
import PaginationWrapper from "./PaginationWrapper";

import { Spinner } from "@nextui-org/react";
import _ from "lodash";
import { useSearchParams } from "next/navigation";
import { IoMdArrowForward, IoMdArrowRoundForward } from "react-icons/io";

const IntialState = {
  teacher: "",
  organization: "",
  tags: [] as string[],
  price: {
    min: 0,
    max: 99999,
  },
  category: "",
};

type StateType = typeof IntialState;

type ActionType = {
  type: string;
  value: any;
};

export type ReducerType = [StateType, React.Dispatch<ActionType>];

const ReducerAction = (state: StateType, action: ActionType) => {
  let newState = { ...state };
  return _.set(newState, action.type as string, action.value);
};

const Course = () => {
  const { data, loading } = useQuery(COURSES_QUERY, {
    variables: {
      where: {
        status: {
          equals: "live",
        },
      },
    },
  });

  const searchParams = useSearchParams();

  const categoryS = searchParams.get("category");
  const subcategoryS = searchParams.get("subcategory");
  const topicS = searchParams.get("topic");
  const searchText = searchParams.get("search");

  const [filter, dispatch] = useReducer(ReducerAction, IntialState);

  const { courses, categories, tags } = useMemo(() => {
    let courses: CourseData[] = data?.courses || [];

    if (categoryS) {
      courses = courses.filter((v) => v.course_category == categoryS);
    }

    if (subcategoryS) {
      courses = courses.filter((v) => v.course_subcategory == subcategoryS);
    }

    if (topicS) {
      courses = courses.filter((v) => v.popular_topics == topicS);
    }

    if (searchText) {
      courses = courses.filter((v) => {
        return Object.values(v as object).some((v) =>
          v?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
        );
      });
    }

    let categories: string[] = [];
    let tags: string[] = [];

    for (let course of courses) {
      if (!categories.includes(course.course_category)) {
        categories.push(course.course_category);
      }
      tags = tags.concat(
        course.course_tags.split(",").map((val) => val.trim())
      );
    }

    return {
      courses,
      categories,
      tags,
    };
  }, [data, categoryS, subcategoryS, topicS, searchText]);

  const newCourseData = useMemo(() => {
    let newData = courses;

    newData = filter.category
      ? newData.filter((v) => v.course_category == filter.category)
      : newData;

    newData = filter.organization
      ? newData.filter((v) =>
          v.teacher?.organization?.name?.includes(filter.organization)
        )
      : newData;
    newData = filter.teacher
      ? newData.filter((v) => v.teacher?.name?.includes(filter.teacher))
      : newData;

    newData = filter.tags.length
      ? newData.filter((v) =>
          filter.tags.some((t) => v.course_tags.includes(t))
        )
      : newData;

    newData = newData.filter(
      (v) => v.price >= filter.price.min && v.price <= filter.price.max
    );
    return newData;
  }, [courses, filter]);

  return (
    <div>
      <div className="pt-[32px] lg:pt-[50px]"></div>

      <div className="container">
        {(categoryS || subcategoryS || topicS) && (
          <div className="flex items-center gap-4">
            {categoryS && <div className="text-2xl font-bold">{categoryS}</div>}
            {subcategoryS && <IoMdArrowRoundForward size={32} />}
            {subcategoryS && (
              <div className="text-2xl font-bold">{subcategoryS}</div>
            )}
            {topicS && <IoMdArrowForward size={32} />}

            {topicS && <div className="text-2xl font-bold">{topicS}</div>}
          </div>
        )}
        {searchText && (
          <div className="flex items-center gap-4">
            <div className="text-2xl ">Search result of : </div>
            <div className="text-2xl font-bold">{searchText}</div>
          </div>
        )}
      </div>

      <div className="pt-[32px] lg:pt-[50px]"></div>

      <div className="container">
        <div className="flex flex-col md:flex-row gap-5">
          <div className="md:w-[320px]  ">
            <FilterSidebar
              categories={categories}
              tags={tags}
              dispatch={dispatch}
              filter={filter}
            />
          </div>
          <div className="md:w-[calc(100%-340px)]">
            {newCourseData.length > 0 ? (
              <PaginationWrapper dataArr={newCourseData}>
                {(d) => (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {d.map((v, i) => (
                      <div key={"ghd" + i}>
                        <CourseItem data={v} />
                      </div>
                    ))}
                  </div>
                )}
              </PaginationWrapper>
            ) : loading ? (
              <div className="h-[200px] flex gap-4 items-center justify-center">
                <Spinner /> Loading...
              </div>
            ) : (
              <div className="text-xl">No course found!</div>
            )}
          </div>
        </div>
      </div>
      <div className="pt-[110px]"></div>
    </div>
  );
};

export default Course;
