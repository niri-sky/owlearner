import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type InputDataType = {
  [k: string]: string | number | undefined;
};

export const createCsvFromData = (d: InputDataType[]) => {
  const headers = Array.from(new Set(d.flatMap((v) => Object.keys(v))));

  const body = d.map((v) => {
    const emptyBody = [...Array(headers.length)];
    Object.entries(v).forEach(([key, value]) => {
      const getIndex = headers.findIndex((h) => h == key);
      if (getIndex >= 0) {
        emptyBody[getIndex] = value;
      }
    });
    return emptyBody;
  });

  return [headers, ...body].map((v) => v.join(",")).join("\n");
};

export const downloadCsvFile = (str: string, fileName: string = "result") => {
  const blob = new Blob([str], { type: "text/csv" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `${fileName}.csv`);

  a.click();
};

export const generateCsv = (
  data: InputDataType[],
  fileName: string = "download"
) => {
  const csv = createCsvFromData(data);
  downloadCsvFile(csv, fileName);
};
