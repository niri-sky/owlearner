import React, { useMemo, useState } from "react";

import { RiTimer2Line } from "react-icons/ri";

import { RiBarChartLine } from "react-icons/ri";
import { PiNotebook } from "react-icons/pi";
import { PiNotepad } from "react-icons/pi";

import { Button, Modal, cn, useDisclosure } from "@nextui-org/react";
import AlarmIcon from "./icons/AlarmIcon";
import Enrolled from "./icons/Enrolled";
import EditInformationOptionModal from "./EditInformationOptionModal";

type Props = {
  data?: CourseData;
};

function RightDetails({ data }: Props) {
  const { isOpen: editInfoModal, onOpenChange: infoModalChange } =
    useDisclosure();

  return (
    <div className="right-section lg:w-[424px]">
      <div className="bg-[#fff] border border-[#E9EAF0] shadow-[0px_6px_16px_0px_#0000000F]">
        <div className=" ">
          <div className="p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-[24px] leading-[32px] text-[#1D2026]">
                  ${data?.price}
                </div>
                {data?.estimated_price && (
                  <div className="text-base text-[#8C94A3] line-through">
                    ${data?.estimated_price}
                  </div>
                )}
              </div>
              <div className="text-[#C713CB] bg-[#FFEEE8] font-dmsans font-medium text-sm leading-[1] p-[8px_12px]">
                {calculatePercentageOff(
                  data?.estimated_price || 0,
                  data?.price || 0
                ).toFixed(0)}
                % off
              </div>
            </div>
            {/* <div className="pt-3"></div> */}
            {/* <div>
              <div className="flex items-center gap-2">
                <AlarmIcon />
                <div className="font-dmsans text-sm font-medium leading-[20px] text-[#E34444]">
                  2 days left at this price!
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <hr className=" bg-[#E9EAF0]" />
        <div className="p-3 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiTimer2Line size={24} color="#A1A5B3" />
                <div className="text-[14px] leading-[22px] text-[#1D2026]">
                  Course Duration
                </div>
              </div>
              <div className="text-[14px] text-right leading-[22px] text-[#6E7485] ">
                {data?.duration}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiBarChartLine size={24} color="#A1A5B3" />
                <div className="text-[14px] leading-[22px] text-[#1D2026]">
                  Course Level
                </div>
              </div>
              <div className="text-[14px] text-right leading-[22px] text-[#6E7485] ">
                {data?.level}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiNotebook size={24} color="#A1A5B3" />
                <div className="text-[14px] leading-[22px] text-[#1D2026]">
                  Language
                </div>
              </div>
              <div className="text-[14px] text-right leading-[22px] text-[#6E7485] ">
                {data?.language}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Enrolled />
                <div className="text-[14px] leading-[22px] text-[#1D2026]">
                  Students Enrolled
                </div>
              </div>
              <div className="text-[14px] text-right leading-[22px] text-[#6E7485] ">
                {data?.studentCourse?.length || 0}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiNotepad size={24} color="#A1A5B3" />
                <div className="text-[14px] leading-[22px] text-[#1D2026]">
                  Subtittle Language
                </div>
              </div>
              <div className="text-[14px] text-right leading-[22px] text-[#6E7485] ">
                {data?.subtitle_language}
              </div>
            </div>
          </div>
        </div>
        <hr className=" bg-[#E9EAF0]" />

        <div className=" p-3 md:p-6 flex flex-col gap-3">
          <button
            onClick={infoModalChange}
            className="h-[56px] text-white bg-[#C713CB] w-full font-bold font-dmsans text-lg leading-[56px] tracking-[-0.18px] capitalize"
          >
            Edit Informations and options
          </button>
          {/* <div className="grid grid-cols-2 gap-3">
            <button
              className={cn(
                "h-10 border border-[#E9EAF0] text-[#4E5566] text-sm leading-[40px] disabled:opacity-60 tracking-[-0.056px] font-bold font-dmsans"
              )}
            >
              Add to wishlist
            </button>
            <button className="h-10 border border-[#E9EAF0] text-[#4E5566] text-sm leading-[40px] tracking-[-0.056px] font-bold font-dmsans">
              Gift Course
            </button>
          </div> */}
          <div className="text-sm leading-[22px] text-[#8C94A3]">
            <span className="font-medium text-[#6E7485]">Note:</span> all course
            have 30-days money-back guarantee
          </div>
        </div>

        <hr className=" bg-[#E9EAF0]" />
        <div className="p-3 md:p-6">
          <div className="text-base font-medium font-playfair text-[#1D2026]">
            This course includes:
          </div>
          <div className="pt-4"></div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeMiterlimit={10}
                />
                <path
                  d="M12 6.75V12H17.25"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="text-[14px] font-dmsans leading-[22px] text-[#4E5566]">
                Lifetime access
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2.25V4.5"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19.5V21.75"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.25 8.25C17.25 7.75754 17.153 7.26991 16.9645 6.81494C16.7761 6.35997 16.4999 5.94657 16.1517 5.59835C15.8034 5.25013 15.39 4.97391 14.9351 4.78545C14.4801 4.597 13.9925 4.5 13.5 4.5H10.125C9.13044 4.5 8.17661 4.89509 7.47335 5.59835C6.77009 6.30161 6.375 7.25544 6.375 8.25C6.375 9.24456 6.77009 10.1984 7.47335 10.9017C8.17661 11.6049 9.13044 12 10.125 12H14.25C15.2446 12 16.1984 12.3951 16.9017 13.0983C17.6049 13.8016 18 14.7554 18 15.75C18 16.7446 17.6049 17.6984 16.9017 18.4017C16.1984 19.1049 15.2446 19.5 14.25 19.5H9.75C8.75544 19.5 7.80161 19.1049 7.09835 18.4017C6.39509 17.6984 6 16.7446 6 15.75"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="text-[14px] font-dmsans leading-[22px] text-[#4E5566]">
                30-days money-back guarantee
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 10.5H16.5"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 13.5H16.5"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 3.75V20.25"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="text-[14px] font-normal font-dmsans leading-[22px] text-[#4E5566]">
                Free exercises file & downloadable resources
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.25 5.25V10.4153C5.25 14.1372 8.227 17.2222 11.9488 17.2498C12.8395 17.2566 13.7228 17.087 14.5476 16.7508C15.3725 16.4146 16.1226 15.9185 16.7548 15.291C17.3871 14.6636 17.8889 13.9172 18.2313 13.0949C18.5737 12.2727 18.75 11.3907 18.75 10.5V5.25C18.75 5.05109 18.671 4.86032 18.5303 4.71967C18.3897 4.57902 18.1989 4.5 18 4.5H6C5.80109 4.5 5.61032 4.57902 5.46967 4.71967C5.32902 4.86032 5.25 5.05109 5.25 5.25Z"
                  stroke="#C713CB"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 21H15"
                  stroke="#C713CB"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 17.25V21"
                  stroke="#C713CB"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.5828 12H19.5001C20.2957 12 21.0588 11.6839 21.6214 11.1213C22.184 10.5587 22.5 9.79565 22.5 9V7.5C22.5 7.30109 22.421 7.11032 22.2804 6.96967C22.1397 6.82902 21.949 6.75 21.75 6.75H18.7501"
                  stroke="#C713CB"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.43408 12H4.48804C3.69239 12 2.92933 11.6839 2.36672 11.1213C1.80411 10.5587 1.48804 9.79565 1.48804 9V7.5C1.48804 7.30109 1.56705 7.11032 1.70771 6.96967C1.84836 6.82902 2.03912 6.75 2.23804 6.75H5.23804"
                  stroke="#C713CB"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <div className="text-[14px] font-normal font-dmsans leading-[22px] text-[#4E5566]">
                Shareable certificate of completion
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 18L19.5 18C20.3284 18 21 17.3284 21 16.5V6C21 5.17157 20.3284 4.5 19.5 4.5L4.5 4.5C3.67157 4.5 3 5.17157 3 6V16.5C3 17.3284 3.67157 18 4.5 18Z"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 21H9"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="text-[14px] font-normal font-dmsans leading-[22px] text-[#4E5566]">
                Access on mobile , tablet and TV
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12.0005H15"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 15.0005H15"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.25 3.75049H18.75C18.9489 3.75049 19.1397 3.82951 19.2803 3.97016C19.421 4.11081 19.5 4.30158 19.5 4.50049V18.7505C19.5 19.3472 19.2629 19.9195 18.841 20.3415C18.419 20.7634 17.8467 21.0005 17.25 21.0005H6.75C6.15326 21.0005 5.58097 20.7634 5.15901 20.3415C4.73705 19.9195 4.5 19.3472 4.5 18.7505V4.50049C4.5 4.30158 4.57902 4.11081 4.71967 3.97016C4.86032 3.82951 5.05109 3.75049 5.25 3.75049Z"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 2.25049V5.25049"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2.25049V5.25049"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 2.25049V5.25049"
                  stroke="#C713CB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="text-[14px] font-normal font-dmsans leading-[22px] text-[#4E5566]">
                English subtitles
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 16.5L12 21.75L21 16.5"
                  stroke="#C713CB"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 12L12 17.25L21 12"
                  stroke="#C713CB"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 7.5L12 12.75L21 7.5L12 2.25L3 7.5Z"
                  stroke="#C713CB"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <div className="text-[14px] font-normal font-dmsans leading-[22px] text-[#4E5566]">
                100% online course
              </div>
            </div>
          </div>
        </div>
        <hr className=" bg-[#E9EAF0]" />
        <div className="p-3 md:p-6">
          <div className="text-base font-medium font-playfair text-[#1D2026]">
            Share this course:
          </div>
          <div className="pt-4"></div>
          <div className="flex items-center gap-2">
            <button className="h-9 md:h-[48px] flex gap-3 items-center justify-center font-medium font-dmsans px-2 md:px-5 text-sm leading-5 text-[#4E5566] bg-[#F5F7FA]">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.75 15.7495H20.25V3.74951H8.25V8.24951"
                  stroke="#4E5566"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.7498 8.24951H3.74976V20.2495H15.7498V8.24951Z"
                  stroke="#4E5566"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copy link
            </button>
            <button className="h-9 md:h-[48px] flex gap-3 items-center justify-center font-medium font-dmsans px-2 md:px-[14px] text-sm leading-5 text-[#4E5566] bg-[#F5F7FA]">
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2961_665)">
                  <path
                    d="M13.331 3.32083H15.1568V0.140833C14.8418 0.0975 13.7585 0 12.4968 0C9.86434 0 8.06101 1.65583 8.06101 4.69917V7.5H5.15601V11.055H8.06101V20H11.6227V11.0558H14.4102L14.8527 7.50083H11.6218V5.05167C11.6227 4.02417 11.8993 3.32083 13.331 3.32083Z"
                    fill="#4E5566"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2961_665">
                    <rect width={20} height={20} fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button className="h-9 md:h-[48px] flex gap-3 items-center justify-center font-medium font-dmsans px-2 md:px-[14px] text-sm leading-5 text-[#4E5566] bg-[#F5F7FA]">
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2961_3444)">
                  <path
                    d="M20 3.79875C19.2563 4.125 18.4637 4.34125 17.6375 4.44625C18.4875 3.93875 19.1363 3.14125 19.4412 2.18C18.6488 2.6525 17.7738 2.98625 16.8412 3.1725C16.0887 2.37125 15.0162 1.875 13.8462 1.875C11.5763 1.875 9.74875 3.7175 9.74875 5.97625C9.74875 6.30125 9.77625 6.61375 9.84375 6.91125C6.435 6.745 3.41875 5.11125 1.3925 2.6225C1.03875 3.23625 0.83125 3.93875 0.83125 4.695C0.83125 6.115 1.5625 7.37375 2.6525 8.1025C1.99375 8.09 1.3475 7.89875 0.8 7.5975C0.8 7.61 0.8 7.62625 0.8 7.6425C0.8 9.635 2.22125 11.29 4.085 11.6712C3.75125 11.7625 3.3875 11.8062 3.01 11.8062C2.7475 11.8062 2.4825 11.7913 2.23375 11.7362C2.765 13.36 4.2725 14.5538 6.065 14.5925C4.67 15.6838 2.89875 16.3412 0.98125 16.3412C0.645 16.3412 0.3225 16.3263 0 16.285C1.81625 17.4563 3.96875 18.125 6.29 18.125C13.835 18.125 17.96 11.875 17.96 6.4575C17.96 6.27625 17.9538 6.10125 17.945 5.9275C18.7588 5.35 19.4425 4.62875 20 3.79875Z"
                    fill="#4E5566"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2961_3444">
                    <rect width={20} height={20} fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button className="h-9 md:h-[48px] flex gap-3 items-center justify-center font-medium font-dmsans px-[6px] md:px-[12px] text-sm leading-5 text-[#4E5566] bg-[#F5F7FA]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 5.25L12 13.5L3 5.25"
                  stroke="#4E5566"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 5.25H21V18C21 18.1989 20.921 18.3897 20.7803 18.5303C20.6397 18.671 20.4489 18.75 20.25 18.75H3.75C3.55109 18.75 3.36032 18.671 3.21967 18.5303C3.07902 18.3897 3 18.1989 3 18V5.25Z"
                  stroke="#4E5566"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.3636 12L3.2312 18.538"
                  stroke="#4E5566"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.7687 18.5381L13.6362 12"
                  stroke="#4E5566"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button className="h-9 md:h-[48px] flex gap-3 items-center justify-center font-medium font-dmsans px-2 md:px-[14px] text-sm leading-5 text-[#4E5566] bg-[#F5F7FA]">
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2961_3482)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.6322 3.34007C14.878 1.58386 12.5451 0.616264 10.0598 0.615234C4.93861 0.615234 0.770668 4.78306 0.768608 9.90566C0.767921 11.5432 1.1957 13.1417 2.0088 14.5507L0.690674 19.3652L5.6161 18.0732C6.97325 18.8135 8.50115 19.2036 10.0561 19.2041H10.06C15.1806 19.2041 19.349 15.0359 19.351 9.9131C19.352 7.43042 18.3864 5.09617 16.6322 3.34007ZM10.0598 17.635H10.0566C8.67098 17.6344 7.312 17.262 6.12616 16.5586L5.84429 16.3911L2.92147 17.1579L3.70161 14.3082L3.51794 14.016C2.74489 12.7865 2.33668 11.3654 2.33736 9.90623C2.33897 5.64846 5.80332 2.18445 10.0629 2.18445C12.1256 2.18513 14.0646 2.98943 15.5226 4.44912C16.9805 5.90881 17.783 7.84904 17.7823 9.91253C17.7805 14.1706 14.3164 17.635 10.0598 17.635ZM14.2958 11.8513C14.0637 11.735 12.9222 11.1736 12.7094 11.096C12.4967 11.0185 12.3418 10.9799 12.1872 11.2122C12.0323 11.4445 11.5875 11.9675 11.452 12.1224C11.3165 12.2773 11.1812 12.2968 10.949 12.1805C10.7168 12.0644 9.96886 11.8191 9.08205 11.0282C8.39197 10.4126 7.92609 9.6524 7.79059 9.42009C7.65532 9.18754 7.78944 9.07402 7.89244 8.9463C8.14375 8.63422 8.39541 8.30704 8.47277 8.1522C8.55025 7.99724 8.51145 7.86163 8.45331 7.74547C8.39541 7.62932 7.93112 6.48662 7.73772 6.02165C7.54912 5.56915 7.35789 5.63026 7.21529 5.62317C7.08002 5.61642 6.92519 5.61504 6.77035 5.61504C6.61562 5.61504 6.36408 5.67306 6.15122 5.90561C5.93848 6.13804 5.33881 6.6996 5.33881 7.84229C5.33881 8.98498 6.17068 10.0889 6.28672 10.2438C6.40276 10.3988 7.9238 12.7437 10.2526 13.7492C10.8064 13.9886 11.2388 14.1313 11.5761 14.2383C12.1322 14.415 12.6382 14.39 13.0383 14.3303C13.4844 14.2636 14.4117 13.7686 14.6053 13.2264C14.7987 12.6841 14.7987 12.2193 14.7406 12.1224C14.6827 12.0256 14.5278 11.9675 14.2958 11.8513Z"
                    fill="#4E5566"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2961_3482">
                    <rect width={20} height={20} fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {data && (
        <Modal
          size="5xl"
          scrollBehavior="outside"
          isOpen={editInfoModal}
          onOpenChange={infoModalChange}
        >
          <EditInformationOptionModal data={data} />
        </Modal>
      )}
    </div>
  );
}

export default RightDetails;

export function calculatePercentageOff(oldPrice: number, newPrice: number) {
  const percentageOff = ((oldPrice - newPrice) / oldPrice) * 100;
  return percentageOff;
}
