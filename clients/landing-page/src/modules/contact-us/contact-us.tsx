import React from "react";
import ContactUsElement from "./elements/contactUsElement";
import SectionTitle from "@/shared/components/section-title";
import { contactUsData } from "@/app/configs/constants";

const ContactUs = () => {
  return (
    <section className="xl:py-[110px] lg:py-[60px] md:py-[40px] py-8 w-full bg-white">
      <div className="container">
        <div className="flex w-full flex-col xl:gap-[80px] lg:gap-[50px] md:gap-[40px] gap-[32px] ">
          <div className="grid sm:grid-cols-3 grid-cols-1 items-center gap-6">
            {contactUsData.map(
              ({ Icon, desc, title }: contactUsDataTypes, i: number) => (
                <ContactUsElement
                  key={i}
                  Icon={Icon}
                  desc={desc}
                  title={title}
                />
              )
            )}
          </div>
          {/* contact us form */}
          <div className="flex flex-col xl:gap-[56px] lg:gap-[35px] md:gap-[30px] gap-[32px] w-full">
            <SectionTitle title="Free consultation right now" />
            <form className="md:w-[80%] w-full mx-auto flex flex-col md:gap-6 gap-4">
              <div className="flex sm:flex-row flex-col items-center w-full lg:gap-8 gap-4">
                <div className="w-full">
                  <input
                    className="py-[11px] w-full px-3 border border-bColor text-txt rounded-[4px] outline-none"
                    placeholder="Your name"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
                <div className="w-full">
                  <input
                    className="py-[11px] w-full px-3 border border-bColor text-txt rounded-[4px] outline-none"
                    placeholder="Your Email"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
              </div>
              <div className="flex sm:flex-row flex-col items-center w-full lg:gap-8 gap-4">
                <div className="w-full">
                  <input
                    className="py-[11px] w-full px-3 border border-bColor text-txt rounded-[4px] outline-none"
                    placeholder="Your Phone"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
                <div className="w-full">
                  <input
                    className="py-[11px] w-full px-3 border border-bColor text-txt rounded-[4px] outline-none"
                    placeholder="Your Website"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
              </div>
              <div className="w-full">
                <textarea
                  className="py-[11px] w-full px-3 border border-bColor text-txt rounded-[4px] outline-none"
                  placeholder="Message...."
                  name=""
                  id=""
                  cols={40}
                  rows={5}
                ></textarea>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="sm:py-[18px] py-4 sm:px-[50px] px-[22px] rounded-full bg-primary hover:bg-[#df13e2] text-white border-none outline-none sm:text-[16px] text-sm"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
