import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Combine all your protected routes here
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/superadmin(.*)",
  "/answer(.*)",
  "/create(.*)",  // <- newly added
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
})

export const config = {
  matcher: [
    '/admin(.*)',
    '/superadmin(.*)',
    '/answer(.*)',
    '/create(.*)',  // <- newly added
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
