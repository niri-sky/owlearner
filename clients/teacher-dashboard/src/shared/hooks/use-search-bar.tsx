import { Input, InputProps } from "@nextui-org/react";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";

export function useSearchBar<T>(data: T[]) {
  const [searchTxt, setSearchTxt] = useState("");

  const filterData = useMemo(() => {
    let d = data;

    d = d.filter((v: T) => {
      return Object.values(v as object).some((v) =>
        v?.toString()?.toLowerCase()?.includes(searchTxt?.toLowerCase())
      );
    });

    return d;
  }, [searchTxt, data]);

  const searchProps = {
    value: searchTxt,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target?.focus();
      setSearchTxt(e.target.value);
    },
  };

  return { searchProps, filterData };
}

export function SearchBar(props: InputProps) {
  return (
    <Input
      classNames={{
        base: "max-w-full  h-10",
        mainWrapper: "h-full",
      }}
      style={{ backgroundColor: "transparent" }}
      placeholder="Search here"
      size="sm"
      startContent={<IoIosSearch size={18} />}
      type="search"
      {...props}
    />
  );
}
