export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/documents/:path*",
    "/api/documents/:path*",
  ],
};
