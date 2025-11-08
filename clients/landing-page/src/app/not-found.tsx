import Image from "next/image";
import Link from "next/link";

// custom files import
import NotFoundImg from "@/shared/assets/img/not-found.png";

const NotFound = () => {
  return (
    <div className="w-full">
      <div className="container">
        <div className="min-h-screen justify-between items-center flex md:flex-row flex-col lg:gap-[63px] md:gap-[40px] w-full">
          <div className="w-full flex flex-col lg:gap-[32px] md:gap-[20px] gap-[15px]">
            <div>
              <h2 className="text-[#E9EAF0] lg:leading-[80px] md:leading-[50px] leading-[30px] lg:text-[80px] md:text-[50px] text-[40px] font-bold">
                Error 404
              </h2>
            </div>
            <div>
              <h3 className="lg:text-[48px] md:text-[32px] text-[24px] lg:leading-[52px] mdleading-[35px] leading-[20px] font-semibold text-title">
                Oops! page not found
              </h3>
            </div>

            <div>
              <p className="md:text-[20px] text-medium md:leading-[32px] text-txt">
                Something went wrong. It’s look that your requested could not be
                found. It&apos;s look like the link is broken or the page is
                removed.
              </p>
            </div>
            <div className="flex">
              <Link
                className="capitalize text-white lg:px-12 md:px-8 px-8 lg:py-4 py-3  bg-primary rounded-full block hover:bg-primary/90"
                href="/"
              >
                go back
              </Link>
            </div>
          </div>
          <div className="w-full">
            <Image src={NotFoundImg} alt="not found image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
