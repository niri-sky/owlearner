import { useCouseAccessData } from "@/shared/context/CourseAccessProvider";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

function ResoursesSection() {
  const { activeContentData } = useCouseAccessData();

  return activeContentData?.links?.length > 0 ? (
    <div>
      <div className="flex flex-col gap-3 py-6">
        {activeContentData?.links?.map((v, i) => (
          <div
            key={"sg" + i}
            className="flex items-center justify-between p-3 bg-primary bg-opacity-5 rounded"
          >
            <div>
              {i + 1}. {v.title}
            </div>
            <a href={v.link}>
              <Button size="sm" color="default">
                Link
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="py-6">Resources not found</div>
  );
}

export default ResoursesSection;
