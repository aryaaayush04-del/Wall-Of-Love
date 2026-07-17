import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16 Proxy (formerly Middleware) — Server-side route protection.
 *
 * Runs on the server before every matched route is rendered.
 * Uses @supabase/ssr to read + refresh the auth session from cookies,
 * then redirects unauthenticated visitors away from protected routes.
 *
 * Key behaviours:
 *  1. Creates a Supabase client wired to the request/response cookies
 *     so session tokens are refreshed transparently on every request.
 *  2. Calls `getUser()` (not `getSession()`) — this hits the Supabase
 *     Auth server to validate the JWT, which is the only safe check
 *     for server-side protection.
 *  3. Redirects to /login if the user is not authenticated and the
 *     route is protected.
 *  4. Redirects authenticated users away from /login back to /.
 */
export async function proxy(request: NextRequest) {
  // ── 1. Bootstrap a response we can attach Set-Cookie headers to ──────────
  let supabaseResponse = NextResponse.next({
    request,
  });

  // ── 2. Create a Supabase client wired to request & response cookies ──────
  //    This is the standard @supabase/ssr pattern for middleware / proxy.
  //    `getAll` reads cookies from the incoming request.
  //    `setAll` writes refreshed tokens onto BOTH the request (so downstream
  //    Server Components see fresh cookies) AND the response (so the browser
  //    receives the updated Set-Cookie headers).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Forward refreshed cookies onto the request so that downstream
          // Server Components / Route Handlers see the updated values.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Recreate the response so our Set-Cookie headers are fresh.
          supabaseResponse = NextResponse.next({
            request,
          });

          // Write Set-Cookie headers onto the outgoing response.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ── 3. Validate the session (server-side, JWT-verified) ──────────────────
  //    IMPORTANT: Always use getUser(), NEVER rely solely on getSession().
  //    getSession() only reads the JWT from the cookie without validation,
  //    whereas getUser() sends the token to the Supabase Auth server for
  //    verification. Only getUser() is safe for server-side protection.
  //
  //    This call also refreshes the session cookie automatically when the
  //    token is close to expiry — the refreshed token is written back via
  //    the setAll callback above.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── 4. Protect private routes ────────────────────────────────────────────
  //    If the user is NOT authenticated and the route is protected,
  //    redirect to /login immediately.
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings");

  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ── 5. Redirect authenticated users away from /login ─────────────────────
  //    If a logged-in user navigates to /login, send them to the dashboard.
  if (user && (pathname === "/login" || pathname === "/")) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // ── 6. Return the (possibly cookie-refreshed) response ───────────────────
  return supabaseResponse;
}

// ─── Route Matcher ──────────────────────────────────────────────────────────
//
// Aggressively protects all private routes while skipping assets that don't
// need auth checks. The matcher ensures the proxy runs on:
//   • /            (dashboard / home)
//   • /settings    (and sub-routes)
//   • /login       (to redirect already-authenticated users)
//
// Excluded (via negative lookahead):
//   • _next/static  — compiled JS/CSS bundles
//   • _next/image   — optimised images
//   • favicon.ico   — browser icon
//   • /widget/*     — public embeddable widget
//   • /embed/*      — public embed page
//   • /submit/*     — public testimonial submission
//   • /auth/*       — Supabase auth callback
//   • Static file extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
//
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|widget|embed|submit|auth|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
