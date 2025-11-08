export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/teachers",
    "/invoices",
    "/courses",
    "/tickets",
    "/profile",
    "/analytics",
  ],
};
