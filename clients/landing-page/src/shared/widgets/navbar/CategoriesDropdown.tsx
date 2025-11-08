import { cn } from "@nextui-org/react";
import React, { SVGProps, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { categoryData } from "./data";
import { useOutsideClick } from "outsideclick-react";
import { useQuery } from "@apollo/client";
import { CATEGORIES_QUERY } from "@/graphql/queries";
import Link from "next/link";

function CategoriesDropdown() {
  const { data } = useQuery(CATEGORIES_QUERY);

  const categories = data?.categories || [];

  const [isCategoryList, setCategoryList] = useState(false);

  return (
    <div
      onMouseEnter={() => setCategoryList(true)}
      onMouseLeave={() => setCategoryList(false)}
      className="relative"
    >
      <div className="text-txt -my-[10px] leading-[84px] cursor-pointer lg:block hidden hover:text-primary">
        Categories
      </div>
      {isCategoryList && (
        <div className="absolute top-[72px] left-0 z-[999]">
          <CategoryList data={categories} />
        </div>
      )}
    </div>
  );
}

type CategoryItem = {
  name: string;
};
type SubCategory = CategoryItem & {
  topics: CategoryItem[];
};

type CategoryType = {
  name: string;
  icon: string;
  subcategories: SubCategory[];
};

type CategoryListProps = {
  data: CategoryType[];
};

function CategoryList({ data }: CategoryListProps) {
  return (
    <div className="flex relative h-full divide-x-[1px] divide-[#D6D6D6]">
      <div className="h-full py-[6px] pointer-events-auto w-[230px] bg-white ">
        {data.map((v, i) => (
          <CategoryItem key={"gdgf" + i} d={v} />
        ))}
      </div>
    </div>
  );
}

function CategoryItem({ d }: { d: CategoryType }) {
  const [isCategory, setCategory] = useState(false);
  return (
    <div
      onMouseEnter={() => setCategory(true)}
      onMouseLeave={() => setCategory(false)}
    >
      <Link href={`/courses?category=${encodeURIComponent(d.name)}`}>
        <div className=" flex cursor-pointer items-center  p-[8px_14px] justify-between">
          <div
            className={cn(
              "text-sm font-medium flex items-center gap-2 h-[15px] leading-[15px] text-[#2E2E2E]",
              isCategory && "text-[#c713cb]"
            )}
          >
            {d.name}
          </div>
          <ArrowIcon
            className={cn("opacity-0 ", isCategory && "opacity-100")}
          />
        </div>
      </Link>

      {isCategory && (
        <div className="min-h-full border-l-[0.5px] border-[#D6D6D6] py-[6px] absolute top-0 left-[230px] pointer-events-auto w-[230px] bg-white ">
          {d.subcategories.map((v, i) => (
            <SubCategoryItem
              link={`/courses?category=${d.name}`}
              key={"gdgf" + i}
              d={v}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SubCategoryItem({ d, link }: { d: SubCategory; link: string }) {
  const [isSubCategory, setSubCategory] = useState(false);
  return (
    <div
      onMouseEnter={() => setSubCategory(true)}
      onMouseLeave={() => setSubCategory(false)}
    >
      <Link href={`${link}&subcategory=${encodeURIComponent(d.name)}`}>
        <div className=" flex cursor-pointer items-center  p-[8px_14px] justify-between">
          <div
            className={cn(
              "text-sm font-medium flex items-center gap-2 h-[15px] leading-[15px] text-[#2E2E2E]",
              isSubCategory && "text-[#c713cb]"
            )}
          >
            {d.name}
          </div>
          <ArrowIcon
            className={cn("opacity-0 ", isSubCategory && "opacity-100")}
          />
        </div>
      </Link>

      {isSubCategory && (
        <div className=" absolute min-h-full top-0 border-l-[0.5px] border-[#D6D6D6] py-[6px] left-[229px] pointer-events-auto w-[230px] bg-white ">
          {d.topics.map((v, i) => (
            <Link
              href={`${link}&subcategory=${d.name}&topic=${encodeURIComponent(
                v.name
              )}`}
              key={"gdgf" + i}
            >
              <div className="group flex cursor-pointer items-center  p-[8px_14px] justify-between">
                <div className="group-hover:text-[#c713cb] text-sm font-medium flex items-center gap-2 h-[15px] leading-[15px] text-[#2E2E2E]">
                  {v.name}
                </div>
                <ArrowIcon
                  className={cn("opacity-0 group-hover:opacity-100")}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.57997 4.04207C6.3961 3.85983 6.09931 3.86115 5.91707 4.04503C5.73483 4.2289 5.73615 4.52569 5.92003 4.70793L7.02188 5.8C7.46906 6.24321 7.77582 6.54824 7.98338 6.80669C8.185 7.05775 8.25417 7.21901 8.27258 7.36343C8.28414 7.45412 8.28414 7.54588 8.27258 7.63656C8.25417 7.78099 8.185 7.94225 7.98338 8.19331C7.77582 8.45176 7.46907 8.75679 7.02188 9.2L5.92003 10.2921C5.73615 10.4743 5.73483 10.7711 5.91707 10.955C6.09931 11.1388 6.3961 11.1402 6.57997 10.9579L7.70168 9.84619C8.12416 9.42748 8.46946 9.08526 8.71434 8.78034C8.96898 8.46326 9.15332 8.14142 9.20256 7.7551C9.22415 7.58571 9.22415 7.41429 9.20256 7.2449C9.15332 6.85858 8.96898 6.53674 8.71434 6.21966C8.46946 5.91474 8.12417 5.57253 7.70168 5.15381L6.57997 4.04207Z"
        fill="#c713cb"
      />
    </svg>
  );
}

export default CategoriesDropdown;
