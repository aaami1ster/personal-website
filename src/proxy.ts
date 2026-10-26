import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirects unprefixed paths (e.g. `/`) to `/en` or `/ar` using the
// NEXT_LOCALE cookie first, then the Accept-Language header.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next.js internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
