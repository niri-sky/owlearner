"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import RatingStar from "./RatingStar";
import Link from "next/link";
// icons
import { TiTick } from "react-icons/ti";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { cn } from "@nextui-org/react";
import Moment from "react-moment";
import useWishlistCart from "@/shared/hooks/useWishlistCart";
import useUserData from "@/shared/hooks/useUserData";

type Props = {
  data: CourseData;
};

function CourseItem({ data }: Props) {
  const { userData } = useUserData();

  const {
    isExistOnCart,
    isExistOnWishlist,
    handleAddToCart,
    handleAddToWishlist,
  } = useWishlistCart();

  // exist

  const { totalRating, isAlreadyPurchased } = useMemo(() => {
    const reviews = data?.reviews || [];
    let totalReview = 0;
    let reviewCount = 0;

    for (const r of reviews) {
      totalReview += r.rating;
      reviewCount++;
    }

    const isAlreadyPurchased = (data.studentCourse || []).find(
      (v) => String(v.studentId) == String(userData?.id)
    );

    return {
      totalRating: totalReview / reviewCount,
      isAlreadyPurchased,
    };
  }, [data, userData]);

  return (
    <Link className="relative group" href={"/course-details/" + data?.slug}>
      <div
        className="bg-[#fff] h-auto relative rounded-t-[12px] shadow-[0px_0px_80px_0px_#CDCCDC40]
        "
      >
        <div>
          <Image
            src={data?.thumbnail}
            width={312}
            height={183}
            className="w-full h-[183px] object-cover rounded-t-[12px]"
            alt=""
          />
        </div>
        <div className="p-[12px_27px]">
          <div>
            <div className="text-base leading-[24px] tracking-[-0.16px] text-title font-playfair font-semibold">
              {data?.title}
            </div>
            <div className="pt-[6px]"></div>
            <div className="text-sm font-dmsans font-medium leading-[22px] capitalize text-[#6F7582]">
              {data?.teacher?.name}
            </div>
            <div className="pt-[6px]"></div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-dmsans font-medium leading-[22px] capitalize text-[#6F7582]">
                {totalRating || 0}
              </div>
              <RatingStar rating={totalRating || 0} />
              <div className="text-sm font-dmsans font-medium leading-[22px] capitalize text-[#6F7582]">
                ({data?.reviews?.length || 0})
              </div>
            </div>
            <div className="pt-[6px]"></div>
            <div className="flex items-center gap-[10px]">
              <div className="text-sm font-dmsans font-medium leading-[22px] capitalize text-[#1E1E1E]">
                ${data.price}
              </div>
              <div className="text-sm line-through font-dmsans font-medium leading-[22px] capitalize text-[#6F7582]">
                ${data.estimated_price}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-3 p-[4px_16px] left-3 bg-[#C713CB] text-sm leading-[22px] font-dmsans text-[#fff]">
          Bestseller
        </div>
      </div>
      {/* hover box data */}
      <div className="absolute h-full overflow-y-auto w-full top-0 left-0 !bg-[white] border border-bColor shadow-md rounded-md opacity-0 -z-50 group-hover:opacity-100 group-hover:z-[100] transition-all duration-200  px-[20px] py-[20px]">
        <div className="flex flex-col justify-between h-full gap-1">
          <div>
            <div className="overflow-hidden">
              <Link
                className="text-[18px]  font-bold hover:text-primary hover:underline text-title font-playfair"
                href={"/course-details/" + data?.slug}
              >
                <h2 className="w-full line-clamp-1">{data?.title}</h2>
              </Link>
            </div>
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-[#164916]">Updated</span>
              <span className="text-sm text-[#113d11] font-medium">
                {" "}
                <Moment date={data?.updatedAt} format="ll" />
              </span>
            </div>
            <ul className="text-sm text-[gray] flex items-center gap-2">
              <li>{data?.duration}</li>
              <li>{data?.level}</li>
            </ul>
            <div className="mt-2">
              <p
                className="text-sm line-clamp-2"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              ></p>
            </div>
            <ul className="flex flex-col gap-3 text-sm mt-2">
              {data.what_you_will_learn.slice(0, 2).map((v, i) => (
                <li key={"sgd" + i} className="flex items-start gap-3">
                  <span className="mt-1">
                    <TiTick />
                  </span>
                  <span className="line-clamp-1">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="w-full flex items-center justify-between gap-3 mt-4"
          >
            {isAlreadyPurchased ? (
              <div className="w-full">
                <Link href={"/course-access/" + data?.slug}>
                  <button className="w-full py-3 px-8 bg-[#C713CB] hover:bg-[#930c96] text-white border-none outline-none">
                    Go To Course
                  </button>
                </Link>
              </div>
            ) : (
              <div className="w-full">
                {isExistOnCart(data.slug) ? (
                  <Link href={"/cart"}>
                    <button className="w-full py-3 px-8 bg-[#610a63]  text-white border-none outline-none">
                      Go to cart
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleAddToCart(data)}
                    className="w-full py-3 px-8 bg-[#C713CB] hover:bg-[#930c96] text-white border-none outline-none"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            )}

            <div>
              <button
                onClick={() => handleAddToWishlist(data)}
                disabled={isExistOnCart(data.slug) || !!isAlreadyPurchased}
                className={cn(
                  "w-[50px] h-[50px] rounded-full disabled:opacity-50 border-[#333] border-2 flex justify-center items-center cursor-pointer"
                )}
              >
                {isExistOnWishlist(data?.slug) ? (
                  <MdFavorite color={"#333333"} className="text-xl" />
                ) : (
                  <MdFavoriteBorder className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CourseItem;
