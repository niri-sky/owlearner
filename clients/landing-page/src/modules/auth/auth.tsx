"use client";

import Image from "next/image";
import { useState } from "react";

//custom file imports
import AuthImg from "@/shared/assets/img/auth.gif";

//
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { Link, Tab, Tabs } from "@nextui-org/react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { signIn } from "next-auth/react";

const Auth = () => {
  const [selectedTab, setSelectedTab] = useState<any>("login");
  return (
    <div className="w-full">
      <div className="container">
        <div className="max-lg:pt-16"></div>
        <div className="w-full flex items-center justify-between gap-5">
          <div className="w-full h-full lg:block hidden">
            <Image
              className="w-full h-full"
              width={500}
              height={700}
              src={AuthImg}
              alt="Authintication image"
            />
          </div>
          {/* form */}
          <div className="md:w-[60%] mx-auto w-[90%]">
            <Tabs
              aria-label="Tabs form"
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
            >
              <Tab key="login" title="Login">
                <LoginForm />
              </Tab>
              <Tab key="register" title="Register">
                <RegisterForm />
              </Tab>
            </Tabs>
            <div className="w-full flex items-center gap-5 pt-4">
              <div>Or login with</div>
              <div className="flex items-center gap-3">
                <div
                  onClick={() => signIn("google")}
                  className="bg-[#DB4437] hover:bg-[#b91e10] text-white rounded-full w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
                >
                  <FaGoogle className="text-[18px]" />
                </div>
                <div
                  onClick={() => signIn("github")}
                  className="bg-[#000] text-white rounded-full w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
                >
                  <FaGithub className="text-[18px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
