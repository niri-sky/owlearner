export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/manage-team",
    "/account-settings",
    "/todo",
    "/analytics",
    "/courses",
    "/create-course",
    "/edit-course/:path*",
    "/courses/:path*",
    "/invoices",
    "/tickets",
    "/profile",
  ],
};
