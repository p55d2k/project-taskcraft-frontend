import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Exclude /sign-in and /sign-up from protected routes
const isProtectedRoute = createRouteMatcher([
  "/meeting(/.*)?",
  "/new-account(/.*)?",
  "/projects(/.*)?",
  "/tasks(/.*)?",
  "/chat(/.*)?",
  "/project-settings(/.*)?",
  "/dashboard(/.*)?",
  "/recordings(/.*)?",
  "/writing(/.*)?",
  "/ai(/.*)?",
  "/account(/.*)?",
  "/docs(/.*)?",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
