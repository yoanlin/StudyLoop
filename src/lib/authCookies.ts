import { NextResponse } from "next/server";

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set("authjs.session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}
