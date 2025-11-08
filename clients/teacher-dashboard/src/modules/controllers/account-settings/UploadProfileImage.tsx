"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";

function UploadProfileImage() {
  const [file, setFile] = useState<File | null>(null);

  const imgSrc = file
    ? URL.createObjectURL(file)
    : "https://modernize-angular-main.netlify.app/assets/images/profile/user-1.jpg";

  return (
    <>
      <input
        className="hidden"
        type="file"
        name=""
        id="accountImage"
        onChange={(e) => {
          const f = e.target?.files?.[0];
          if (f) {
            setFile(f);
          }
        }}
      />
      <label
        htmlFor="accountImage"
        className="rounded-full w-[120px] h-[120px] overflow-hidden mx-auto relative group"
      >
        <Image
          className="rounded-full object-cover"
          width={120}
          height={120}
          src={imgSrc}
          alt="contact employee image"
        />

        <div className="w-[120px] h-[120px] absolute top-0 bg-txt/50 left-0 hidden group-hover:block cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-camera-fill absolute top-[42px] left-[46px]"
            viewBox="0 0 16 16"
            style={{ color: "white" }}
          >
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
          </svg>
        </div>
      </label>
      {file && (
        <div className="flex gap-3 w-full justify-center items-center">
          <div>
            <Button color="primary">Upload</Button>
          </div>

          <Button
            onClick={() => {
              setFile(null);
            }}
            color="danger"
            variant="bordered"
          >
            Reset
          </Button>
        </div>
      )}
    </>
  );
}

export default UploadProfileImage;
