export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/course-access/:path*",
    "/dashboard/course/:path*",
    "/profile",
    "/profile/post/:path*",
  ],
};
