import * as React from "react";
import { SVGProps } from "react";
const EarningPointsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    className="size-10 text-success"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m9 11 3-3m0 0 3 3m-3-3v8m0-13a9 9 0 1 1 0 18 9 9 0 0 1 0-18z"
    />
  </svg>
);
export default EarningPointsIcon;
