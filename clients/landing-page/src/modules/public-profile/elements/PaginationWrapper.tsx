import { Pagination } from "@nextui-org/react";
import React, { ReactNode, useEffect, useState } from "react";

type Props<T> = {
  children?: (data: T[]) => ReactNode;
  dataArr: T[];
  itemPerPage?: number;
};

function PaginationWrapper<T>({
  dataArr,
  children,
  itemPerPage = 12,
}: Props<T>) {
  const [currentItems, setCurrentItems] = useState<T[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [itemOffset, setItemOffset] = useState<number>(0);

  useEffect(() => {
    const endOffset = itemOffset + itemPerPage;
    setCurrentItems(dataArr.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(dataArr.length / itemPerPage));
  }, [dataArr, itemOffset, itemPerPage]);

  const handlePageClick = (e: number) => {
    const newOffset = (e - 1) * itemPerPage;
    setItemOffset(newOffset);
  };

  return (
    <div>
      <>{children?.(currentItems)}</>
      {dataArr.length > itemPerPage && pageCount && (
        <div className="mt-[70px] flex justify-center items-center">
          <Pagination
            showControls
            onChange={handlePageClick}
            total={pageCount}
            initialPage={1}
          />
        </div>
      )}
    </div>
  );
}

export default PaginationWrapper;
