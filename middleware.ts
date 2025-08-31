// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { auth } from "~/server/auth";

// async function middleware(request: NextRequest) {
//   const session = await auth();
//   const { pathname } = request.nextUrl;

//   console.log({ session, pathname });

//   // Публичные маршруты, которые доступны без аутентификации
//   const publicRoutes = ["/", "/login", "/register"];

//   // API маршруты для аутентификации
//   const authApiRoutes = ["/api/auth"];

//   // Проверяем, является ли маршрут публичным
//   const isPublicRoute = publicRoutes.includes(pathname);
//   const isAuthApiRoute = authApiRoutes.some((route) =>
//     pathname.startsWith(route),
//   );

//   // Если это API маршрут для аутентификации, пропускаем
//   if (isAuthApiRoute) {
//     return NextResponse.next();
//   }

//   // Если пользователь не аутентифицирован и пытается получить доступ к защищенному маршруту
//   if (!session && !isPublicRoute) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Если пользователь аутентифицирован и пытается получить доступ к странице входа/регистрации
//   if (session && (pathname === "/login" || pathname === "/register")) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// export default auth(middleware);
