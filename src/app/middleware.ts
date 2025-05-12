// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const accessToken = request.cookies.get("access_token")?.value;
//   const { pathname } = request.nextUrl;

//   const isAuth = !!accessToken;
//   const isLoginPage = pathname === "/login";

//   // Always allow static files, images, favicon
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/favicon.ico") ||
//     pathname.startsWith("/static")
//   ) {
//     return NextResponse.next();
//   }

//   // 1. If user is NOT authenticated
//   if (!isAuth) {
//     // Allow access to login page
//     if (isLoginPage) {
//       return NextResponse.next();
//     }
//     // Block access to other pages
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // 2. If user IS authenticated
//   if (isLoginPage) {
//     // Block access to login page when already logged in
//     return NextResponse.redirect(new URL("/", request.url)); // or "/dashboard"
//   }

//   // 3. Otherwise allow
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
