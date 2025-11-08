"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { BiArrowBack } from "react-icons/bi";

type Props = {
  slug: string;
};

const TopInfo = ({ slug }: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
      <div>
        <Button
          onClick={() => {
            router.back();
          }}
          startContent={<BiArrowBack />}
          variant="light"
        >
          Go Back
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button size="md" radius="sm">
          Course Certificate
        </Button>
        <Link href={`/course-access/${slug}`}>
          <Button size="md" color="primary" radius="sm">
            Start Course
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default TopInfo;
