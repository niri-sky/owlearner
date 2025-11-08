export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/manage-team",
    "/account-settings",
    "/todo",
    "/organizations",
    "/teachers",
    "/students",
    "/invoices",
    "/courses",
    "/analytics",
    "/tickets",
    "/categories",
  ],
};
