import { UploadItemType } from "@/modules/courses-and-support/create-course/VideoUploadModal";
import React, { useState } from "react";
import api from "../api";
import axios from "axios";

function useUploadFiles() {
  const [uploadFiles, setUploadFiles] = useState<UploadItemType[]>([]);

  async function showUploadingFiles(obj: any) {
    let object: any = obj || {};
    for (let [key, value] of Object.entries(object)) {
      if (typeof value === "object") {
        object[key] = await showUploadingFiles(value);
      }

      if (value instanceof File) {
        const fileObj: File = value;
        setUploadFiles((s) => [
          ...s,
          { file: fileObj, progress: 0, status: "pending" },
        ]);
        object[key] = fileObj;
      }
    }
    return object;
  }

  async function filesUploader(obj: any) {
    let object: any = obj || {};
    for (let [key, value] of Object.entries(object)) {
      if (typeof value === "object") {
        object[key] = await filesUploader(value);
      }

      if (value instanceof File) {
        const fileObj: File = value;

        if (isVideoFile(fileObj)) {
          const { data } = await api.get("/upload/mux/url");
          const url = data?.url;
          const upload_id = data.id;

          await axios.put(url, fileObj, {
            headers: {
              "Content-Type": fileObj.type,
            },
            onUploadProgress: (e) => {
              if (e.progress) {
                setUploadFiles((u) => {
                  let letUploadFiles = [...u];
                  const findOne = letUploadFiles.findIndex(
                    (v) => v.file.name == fileObj.name
                  );
                  if (findOne >= 0) {
                    letUploadFiles[findOne].progress = e.progress! * 100;
                  }
                  return letUploadFiles;
                });
              }
            },
          });

          const { data: dt } = await api.get(
            "/upload/mux/playbackid/" + upload_id
          );

          object[key] = dt.playbackId;
          if ("video_title" in object) {
            const video = await loadVideo(fileObj);
            object["video_duration"] = video.duration
              ? Math.round(video.duration * 1000)
              : 100000;
          }
        } else {
          const formData = new FormData();
          formData.append("file", fileObj);
          const { data: dt } = await api.post("/upload/bucket", formData, {
            onUploadProgress: (e) => {
              if (e.progress) {
                setUploadFiles((u) => {
                  let letUploadFiles = [...u];
                  const findOne = letUploadFiles.findIndex(
                    (v) => v.file.name == fileObj.name
                  );
                  if (findOne >= 0) {
                    letUploadFiles[findOne].progress = e.progress! * 100;
                  }
                  return letUploadFiles;
                });
              }
            },
          });
          object[key] = dt.location;
        }
      }
    }
    return object;
  }

  return {
    uploadFiles,
    showUploadingFiles,
    filesUploader,
    updateUploadFiles: setUploadFiles,
  };
}

export default useUploadFiles;

export function isVideoFile(file: File) {
  var fileName = file.name.toLowerCase();
  var videoExtensions = [
    "mp4",
    "avi",
    "mov",
    "mkv",
    "wmv",
    "flv",
    "mpeg",
    "mpg",
    "webm",
  ];
  for (var i = 0; i < videoExtensions.length; i++) {
    if (fileName.endsWith(videoExtensions[i])) {
      return true;
    }
  }
  return false;
}

function delay(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export const loadVideo = (file: File): Promise<HTMLVideoElement> => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        resolve(video);
      };

      video.onerror = function () {
        reject(new Error("Invalid video. Please select a video file."));
      };

      video.src = window.URL.createObjectURL(file);
    } catch (e: any) {
      reject(new Error(e));
    }
  });
};
