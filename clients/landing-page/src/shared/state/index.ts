import { CourseDataType } from "@/shared/utils/types";
import { atomWithStorage } from "jotai/utils";

export const CART_STATE = atomWithStorage<CourseData[]>("cart", []);

export const WISHLIST_STATE = atomWithStorage<CourseData[]>("wishlist", []);
