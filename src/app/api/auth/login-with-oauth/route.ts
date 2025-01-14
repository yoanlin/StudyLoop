import db from "@/db/db";
import { LogInWithOAuthSchema } from "@/lib/validations";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

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

    await db.$transaction(async (tx) => {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during login: ", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
