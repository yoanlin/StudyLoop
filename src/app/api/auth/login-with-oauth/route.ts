import db from "@/db/db";
import { LogInWithOAuthSchema } from "@/lib/validations";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

// Create User
export async function POST(req: Request) {
  try {
    const { provider, providerAccountId, user } = await req.json();
    const validatedData = LogInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) throw new Error("The data is not valid");

    const { name, username, email, image } = user;

    const result = await db.$transaction(async (tx) => {
      // 查找 or 創建用戶
      let existingUser = await tx.user.findUnique({ where: { email } });

      if (!existingUser) {
        existingUser = await tx.user.create({
          data: {
            name,
            username,
            email,
            image,
            providers: [provider],
          },
        });
      } else {
        if (!existingUser.providers.includes(provider)) {
          await tx.user.update({
            where: { id: existingUser.id },
            data: {
              providers: [...existingUser.providers, provider],
            },
          });
        }
      }

      // 查找或創建 Account
      const existingAccount = await tx.account.findFirst({
        where: {
          userId: existingUser.id,
          provider,
          providerAccountId,
        },
      });

      if (!existingAccount) {
        await tx.account.create({
          data: {
            userId: existingUser.id,
            provider,
            providerAccountId,
            type: "oauth",
          },
        });
      }

      // 創建 session
      const sessionToken = randomBytes(32).toString("hex");
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // expires in 7 days

      await tx.session.create({
        data: {
          sessionToken,
          userId: existingUser.id,
          expires,
        },
      });

      return { sessionToken, user: existingUser };
    });

    // 將 session token 寫入 Cookie
    const cookie = serialize("session_token", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return new Response(JSON.stringify({ success: true, user: result.user }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error during login: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
