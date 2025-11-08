"use client";

import React, { ReactElement, useState } from "react";
// global props

export const Tab: React.FC<ProfileTabProps> = ({ children }) => {
  return <>{children}</>;
};

export const Tabs: React.FC<ProfileTabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center xl:overflow-x-hidden overflow-x-scroll w-full xl:w-full gap-[18px] py-4 bg-[#f3f3f3] p-[16px] rounded-xl mb-4">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const tabElement = child as ReactElement<ProfileTabProps>;
            return (
              <div className="w-max xl:w-max">
                <button
                  className={` w-max xl:w-max focus:outline-none flex items-center hover:text-[#0070F0] gap-2 ${
                    activeTab === index
                      ? "border-b-2 pb-2 text-[#0070F0] border-[#0070F0]"
                      : "pb-2"
                  }`}
                  onClick={() => handleTabClick(index)}
                >
                  <span className="text-[16px]">{tabElement.props.label}</span>
                  {tabElement.props.subCount ? (
                    <span className="text-xs w-max px-1 h-[22px] border-[#e2e2e2] flex justify-center items-center rounded-md border">
                      {tabElement.props.subCount}
                    </span>
                  ) : null}
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div>{React.Children.toArray(children)[activeTab]}</div>
    </div>
  );
};
