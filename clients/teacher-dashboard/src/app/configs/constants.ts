import { atom } from "jotai";

import { VscOrganization } from "react-icons/vsc";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";

// app instances
export const APP_NAME: string = "Owl Learner";
export const APP_MOTO: string =
  "Learn and be a Master of Facebook specialist with Tasfiya";
export const APP_DESCRIPTION: string =
  "Transform Your Online Learning Journey with Instant Digital Marketing Magic";
export const APP_EMAIL: string = "sabrinayasmintasfia@gmail.com";

// sidebar elements
export const isLightMode = atom<string>("light");
export const sidebarActive = atom<boolean>(false);

// nav elements
export const activeNav = atom<string>("/");
export const isOpen = atom<boolean>(false);
export const mobileNav = atom<boolean>(false);
export const navItems: NavItemTypes[] = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

// dashboard elements
export const dashboardReportBoxDatas: DashboardReportBoxDataTypes[] = [
  {
    bgColor: "bg-[#ECF2FF]",
    textColor: "text-[#5d87ff]",
    Icon: VscOrganization,
    iconColor: "text-[#5d87ff]",
    heading: "Organizations",
    count: "96",
  },
  {
    bgColor: "bg-[#E8F7FF]",
    textColor: "text-[#49beff]",
    Icon: FaChalkboardTeacher,
    iconColor: "text-[#49beff]",
    heading: "Teachers",
    count: "356",
  },
  {
    bgColor: "bg-[#FDEDE8]",
    textColor: "text-[#fa896b]",
    Icon: PiStudent,
    iconColor: "text-[#fa896b]",
    heading: "Students",
    count: "$96k",
  },
];

// table datas
export const columns: TableHeadDataTypes[] = [
  { name: "Assigned" },
  { name: "Name" },
  { name: "Position" },
  { name: "Mark" },
];

// table datas
export const students: TableBodyDataTypes[] = [
  {
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    mark: 100,
  },
  {
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    mark: 100,
  },
  {
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    mark: 100,
  },
  {
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    mark: 100,
  },
];
