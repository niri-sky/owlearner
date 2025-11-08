import { cn } from "@nextui-org/react";
import React, { ReactNode, useState } from "react";
import { rswitch } from "rswitch";

type Props = {
  tabs: string[];
  children: () => { [k: string]: ReactNode };
  className?: string;
};

function TabWrapper({ tabs, children, className }: Props) {
  const [tab, setTab] = useState(tabs?.[0]);

  return (
    <div>
      <div
        className={cn("grid grid-cols-3 ", className)}
        style={{
          gridTemplateColumns: `repeat(${tabs?.length || 0}, minmax(0, 1fr))`,
        }}
      >
        {tabs?.map((v, i) => (
          <div
            key={"sgd" + i}
            className={cn(
              "font-dmsans border-b cursor-pointer border-[#E9EAF0] py-5  text-base leading-[22px] text-center text-[#4E5566] font-medium",
              tab == v &&
                "shadow-[0px_-2px_0px_0px_#FF6636_inset] text-[#1D2026]"
            )}
            onClick={() => setTab(v)}
          >
            {v}
          </div>
        ))}
      </div>
      <>{rswitch(tab, children())}</>
    </div>
  );
}

export default TabWrapper;
