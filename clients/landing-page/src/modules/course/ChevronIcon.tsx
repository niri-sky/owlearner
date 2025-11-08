import React, { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

function ChevronIcon(props: Props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.75 12H20.25"
        stroke="#C713CB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5.25L20.25 12L13.5 18.75"
        stroke="#C713CB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChevronIcon;
