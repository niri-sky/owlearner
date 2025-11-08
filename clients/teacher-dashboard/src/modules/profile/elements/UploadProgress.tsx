import React from "react";

type Props = {
  progress?: number;
};

function UploadProgress({ progress }: Props) {
  if (!progress) return <></>;
  return (
    <div className="flex pt-2 flex-col gap-1 rounded">
      <div className="w-full h-[6px] rounded-md bg-[#b6afff]">
        <div
          className="h-full bg-[#7266FC] rounded-md transition-all duration-200"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[#7266FC]">Uploading...</div>
        <div className="text-sm font-semibold text-[#7266FC]">{progress}%</div>
      </div>
    </div>
  );
}

export default UploadProgress;
