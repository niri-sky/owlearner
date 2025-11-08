"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// custom file imports
import { APP_NAME } from "@/app/configs/constants";
import ArrowRight from "@/shared/assets/svg/arrow-right.svg";
// icon images
import LocationIcon from "@/shared/assets/svg/location.svg";
import EmailIcon from "@/shared/assets/svg/email.svg";

import APP_LOGO_SRC from "@/shared/assets/logo.svg";

const Footer = () => {
  const footerRestrictPath = ["/auth", "/forget-password"];
  const pathname = usePathname();

  return (
    <>
      {footerRestrictPath.some((p) => pathname.includes(p)) ? (
        // {footerRestrictPath?.map((p) => pathname.includes(p)) ? (
        <></>
      ) : (
        <footer className="xl:pt-[110px] xl:pb-[94px] lg:py-[60px] md:py-[40px] pb-6 pt-8 w-full bg-white">
          <div className="container">
            <div className="flex flex-col w-full xl:gap-[68px] lg:gap-[48px] gap-[40px]">
              {/* top */}
              <div className="flex md:flex-row flex-col md:gap-5 gap-[32px] w-full">
                {/* left side */}
                <div className="flex md:w-[40%] w-full flex-col gap-6 md:border-r border-0 xl:pr-[126px] lg:pr-[80px] md:pr-[50px]">
                  <div className="w-[180px]">
                    <Image
                      src={APP_LOGO_SRC}
                      alt={APP_NAME}
                      width={210}
                      height={100}
                    />
                  </div>
                  <div>
                    <p className="text-txt text-[16px] w-full">
                      Join our community of students and instructors, and see
                      how Owl Learner can help you grow
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      className="w-full outline-none border-none rounded-l-sm bg-[#F2E3F2] py-[16px] pl-[15px] pr-3"
                      type="text"
                      name=""
                      id=""
                      placeholder="your mail"
                    />
                    <button className="rounded-r-sm py-[16px] px-4 bg-primary hover:bg-[#df13e2] border-none outline-none">
                      <Image src={ArrowRight} alt="Right icon" />
                    </button>
                  </div>
                </div>
                {/* right side */}
                <div className="grid md:grid-cols-3 sm:grid-cols-3 grid-cols-1 items-start md:w-[60%] w-full lg:gap-[5px] gap-5 xl:pl-[126px] lg:pl-[80px] md:pl-[50px] ">
                  <div className="w-full flex flex-col gap-6 border-r sm:border-0">
                    <div className="text-[20px] font-playfair font-semibold text-title capitalize">
                      quick links
                    </div>
                    <ul className="flex flex-col gap-[16px]">
                      <li>
                        <Link className="hover:text-primary" href="/">
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link className="hover:text-primary" href="/">
                          About us
                        </Link>
                      </li>
                      <li>
                        <a
                          href="https://teacher.owllearner.com"
                          className="hover:text-primary no-underline"
                        >
                          Teach at Owl Learner
                        </a>
                      </li>
                      <li>
                        <Link className="hover:text-primary" href="/">
                          Help and Support
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="w-full mt-[23px] sm:mt-0 flex flex-col gap-6">
                    <div className="text-[20px] font-playfair font-semibold text-title capitalize">
                      Contact info
                    </div>
                    <ul className="flex flex-col gap-[16px]">
                      <li className="flex items-start gap-[8px]">
                        <div className="min-w-[24px]">
                          <Image
                            height={24}
                            width={24}
                            src={LocationIcon}
                            alt="Location icon"
                          />
                        </div>
                        <div className="flex gap-[8px] flex-col">
                          <h4 className="font-semibold text-title font-playfair">
                            Address
                          </h4>
                          <p className="text-txt">
                            1234 Trussville Crossings Pkwy, london
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-[8px]">
                        <div className="min-w-[24px]">
                          <Image
                            height={24}
                            width={24}
                            src={EmailIcon}
                            alt="Email icon"
                          />
                        </div>
                        <div className="flex gap-[8px] flex-col">
                          <h4 className="font-semibold text-title font-playfair">
                            Email
                          </h4>
                          <p className="text-txt">team@owllearner.com</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* bottom */}
              <div className="flex items-center lg:flex-row flex-col justify-between sm:gap-5 gap-3">
                <div className="lg:w-[40%] text-center lg:text-left lg:order-1 order-2 w-full">
                  <p className="md:text-[16px] text-sm text-txt">
                    Copyright at 2023 by Eons Academy LLC. All Rights Reserved.
                  </p>
                </div>
                <div className="lg:w-[60%] lg:order-2 order-1 w-full">
                  <ul className="flex lg:justify-end justify-center lg:items-end items-center md:gap-[34px] flex-wrap gap-2 text-txt">
                    <li>
                      <Link
                        className="hover:text-primary md:text-[16px] text-sm"
                        href="/"
                      >
                        License Agreements
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-primary md:text-[16px] text-sm"
                        href="/"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-primary md:text-[16px] text-sm"
                        href="/"
                      >
                        Terms & Conditions
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
