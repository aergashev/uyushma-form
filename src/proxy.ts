import { auth } from "@/lib/auth"

export default auth((request) => {
  const isLogin = request.nextUrl.pathname.startsWith("/admin/login")
  const isAuthed = !!request.auth

  if (!isAuthed && !isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("from", request.nextUrl.pathname)
    return Response.redirect(url)
  }

  if (isAuthed && isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    url.search = ""
    return Response.redirect(url)
  }
})

export const config = {
  matcher: ["/admin/:path*"],
}
