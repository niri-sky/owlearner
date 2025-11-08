import React, { ReactNode, useEffect, useState } from "react";
import {
  Pagination,
  PaginationItemType,
  cn,
  PaginationItemRenderProps,
} from "@nextui-org/react";
import ChevronIcon from "./ChevronIcon";

type Props<T> = {
  children?: (data: T[]) => ReactNode;
  dataArr: T[];
  itemsPerPage?: number;
};

export default function PaginationWrapper<T>({
  dataArr,
  children,
  itemsPerPage = 16,
}: Props<T>) {
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
    isNext,
    isPrevious,
    isFirst,
    isLast,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(
            className,
            " w-8 h-8 min-w-8 lg:min-w-[48px]  lg:w-[48px] lg:h-[48px]",
            "opacity-100 hover:bg-[#C713CB14]"
          )}
          onClick={onNext}
        >
          <ChevronIcon />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(
            className,
            "   w-8 h-8 min-w-8 lg:min-w-[48px]  lg:w-[48px] lg:h-[48px]",
            "opacity-100 hover:bg-[#C713CB14]"
          )}
          onClick={onPrevious}
        >
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }

    // cursor is the default item
    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          className,
          "font-dmsans text-ms leading-[20px]  w-8 h-8 min-w-8 lg:min-w-[48px]  lg:w-[48px] lg:h-[48px] transition-all duration-200 font-medium tracking-[-0.14px] ",
          isActive
            ? "text-white !bg-[#C713CB]  font-bold"
            : "hover:bg-[#C713CB14] hover:text-[#C713CB]"
        )}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  const [currentItems, setCurrentItems] = useState<T[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);

  const [selectedPage, setSelectedPage] = useState<number>(0);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(dataArr.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(dataArr.length / itemsPerPage));
  }, [dataArr, itemOffset, itemsPerPage]);

  const handlePageClick = (e: number) => {
    const newOffset = (e - 1) * itemsPerPage;
    setItemOffset(newOffset);
    setSelectedPage(e);
  };

  useEffect(() => {
    setItemOffset(0);
    setSelectedPage(0);
  }, [dataArr]);

  return (
    <div>
      <>{children?.(currentItems)}</>
      {dataArr.length > itemsPerPage && pageCount && (
        <div className="mt-[70px] flex justify-center items-center">
          <Pagination
            disableCursorAnimation
            showControls
            total={pageCount}
            onChange={handlePageClick}
            initialPage={1}
            page={selectedPage}
            className="gap-2"
            radius="full"
            renderItem={renderItem}
            variant="light"
            classNames={{ wrapper: "flex-wrap md:flex-nowrap" }}
          />
        </div>
      )}
    </div>
  );
}
