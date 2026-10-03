import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/token";

const PRIVATE_PREFIXES = [
  "/inicio",
  "/triagem",
  "/areas",
  "/area/",
  "/mentes",
  "/mente/",
  "/maestro",
  "/conselho/",
  "/conversas",
  "/perfil",
  "/plano",
];
const AUTH_PAGES = ["/entrar", "/cadastro"];

/** Checagem otimista de sessão; as páginas e APIs validam de novo no servidor. */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`));
  if (isPrivate && !session) {
    const url = new URL("/entrar", request.url);
    url.searchParams.set("voltar", pathname + search);
    return NextResponse.redirect(url);
  }
  if (session && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest).*)"],
};
