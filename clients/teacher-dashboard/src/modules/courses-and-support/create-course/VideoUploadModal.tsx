import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  uploadFiles: UploadItemType[];
};

function VideoUploadModal({ uploadFiles }: Props) {
  return (
    <ModalContent>
      {(onclose) => (
        <>
          <ModalHeader>Upload Files</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              {uploadFiles.map((item, i) => (
                <UploadItem key={"sdg" + i} item={item} />
              ))}
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center items-center">
            <div>
              <Spinner classNames={{ wrapper: "w-6 h-6" }} />
            </div>
            <div>Creating course...</div>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
}

export type UploadItemType = {
  file: File;
  progress: number;
  status: string;
};

function UploadItem({ item }: { item: UploadItemType }) {
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div ref={endRef} className="flex p-2 bg-[#E3E0FE] rounded">
      <div className="w-8 h-8 overflow-hidden">
        <FileOrImage file={item.file} />
      </div>

      <div className="w-[calc(100%-32px)] pl-2 flex flex-col gap-1">
        <div className="text-sm truncate text-[#7266FC]">{item.file.name}</div>
        <div className="flex gap-2 items-center">
          <div className="text-xs font-semibold text-[#7266FC]">
            {item.progress.toFixed(0)}%
          </div>
          <div className="w-full h-[6px] rounded-md bg-[#b6afff]">
            <div
              className="h-full bg-[#7266FC] rounded-md transition-all duration-200"
              style={{
                width: `${item.progress.toFixed(0)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileOrImage({ file }: { file: File }) {
  if (file.type.includes("image/")) {
    return (
      <Image
        src={URL.createObjectURL(file)}
        width={32}
        height={32}
        className="w-full h-full object-cover"
        alt=""
      />
    );
  } else {
    return (
      <div className="flex items-center w-full h-full justify-center">
        <svg
          width={24}
          height={24}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7Z"
            stroke={"#7266fc"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 2v7h7"
            stroke={"#7266fc"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
}
export default VideoUploadModal;
