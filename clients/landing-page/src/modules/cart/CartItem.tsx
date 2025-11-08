import { CourseDataType } from "@/shared/utils/types";
import Image from "next/image";
import React, { useMemo } from "react";
import RatingStar from "../course/RatingStar";
import rswitch from "rswitch";
import Link from "next/link";

type Props = {
  data: CourseData;
  onItemClick?: React.MouseEventHandler<HTMLButtonElement>;
  onAddToCartClick?: React.MouseEventHandler<HTMLButtonElement>;

  type?: "cart" | "wishlist";
};

function CartItem({
  data,
  onItemClick,
  type = "cart",
  onAddToCartClick,
}: Props) {
  const { totalRating } = useMemo(() => {
    const reviews = data?.reviews || [];
    let totalReview = 0;
    let reviewCount = 0;

    for (const r of reviews) {
      totalReview += r.rating;
      reviewCount++;
    }

    return {
      totalRating: totalReview / reviewCount,
    };
  }, [data]);

  return (
    <div className="border-t border-[#d1d7dc] py-[16px]">
      <div className="flex flex-col lg:flex-row">
        <div className="mr-4">
          <Image
            src={data?.thumbnail || "/course-image.png"}
            alt="course image"
            width={120}
            height={68}
          />
        </div>

        <div className="flex lg:flex-row flex-col flex-1">
          <div className="flex-1">
            <Link href={"/course-details/" + data?.slug}>
              <div className="font-bold text-[#2d2f31] hover:text-primary">
                {data.title}L
              </div>
            </Link>
            <div className="pt-1"></div>
            <div className="text-xs">By {data?.teacher?.name}</div>
            <div className="pt-2"></div>

            <div className="flex items-center ">
              <div className="text-sm font-bold text-[#4d3105] mr-1">
                {(totalRating || 0).toFixed(1)}
              </div>
              <RatingStar rating={totalRating || 0} />
              <div className="text-[#6a6f73] text-sm ml-1">
                ({totalRating || 0} ratings)
              </div>
            </div>
            <div className="pt-2"></div>

            {/* <div className="flex items-center gap-[10px]">
              <span className="text-xs text-[#6a6f73]">25 total hours</span>
              <div className="w-[5.83px] h-[5.83px] bg-[#6a6f73] rounded-full"></div>
              <span className="text-xs text-[#6a6f73]">165 lectures</span>
              <div className="w-[5.83px] h-[5.83px] bg-[#6a6f73] rounded-full"></div>
              <span className="text-xs text-[#6a6f73]">All Levels</span>
            </div> */}
          </div>
          <div className="lg:pl-6 ">
            <div className=" flex max-lg:gap-3 lg:flex-col ">
              <div>
                <button
                  onClick={onItemClick}
                  className="h-[28px] text-primary text-sm"
                >
                  Remove
                </button>
              </div>
              {rswitch(type, {
                cart: (
                  <div>
                    <button
                      onClick={onAddToCartClick}
                      className="h-[28px] text-primary text-sm"
                    >
                      Save for later
                    </button>
                  </div>
                ),
                wishlist: (
                  <div>
                    <button
                      onClick={onAddToCartClick}
                      className="h-[28px] text-primary text-sm"
                    >
                      Add to cart
                    </button>
                  </div>
                ),
              })}
            </div>
          </div>
        </div>
        <div className="lg:pl-[48px]">
          <div className="font-bold text-[#2d2f31]">
            {" "}
            <span className="line-through text-xs">
              ${data?.estimated_price}
            </span>{" "}
            ${data?.price}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
