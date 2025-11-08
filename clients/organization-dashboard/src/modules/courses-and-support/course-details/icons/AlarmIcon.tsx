import React from "react";

function AlarmIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 5.625V10H14.375"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16.875C13.797 16.875 16.875 13.797 16.875 10C16.875 6.20304 13.797 3.125 10 3.125C6.20304 3.125 3.125 6.20304 3.125 10C3.125 13.797 6.20304 16.875 10 16.875Z"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeMiterlimit={10}
      />
      <path
        d="M15.3032 2.04492L17.9549 4.69657"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.04517 4.69657L4.69682 2.04492"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AlarmIcon;
