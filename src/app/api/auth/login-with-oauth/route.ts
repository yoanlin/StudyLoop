import db from "@/db/db";
import { setAuthCookie } from "@/lib/authCookies";
import { signJwtToken } from "@/lib/jwt";
import { LogInWithOAuthSchema } from "@/lib/validations";
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

    const result = await db.$transaction(async (tx) => {
      let existingUser = await tx.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        existingUser = await tx.user.create({
          data: {
            name,
            username,
            email,
            image,
          },
        });
      } else {
        const updatedData: {
          name?: string;
          image?: string;
        } = {};

        if (existingUser.name !== name) updatedData.name = name;
        if (existingUser.image !== image) updatedData.image = image;

        if (Object.keys(updatedData).length > 0) {
          await tx.user.update({
            where: { email },
            data: updatedData,
          });
        }
      }

      const existingAccount = await tx.account.findFirst({
        where: { userId: existingUser.id, provider, providerAccountId },
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

      return existingUser;
    });

    // Generate JWT
    const jwtPayload = {
      id: result.id,
      name: result.name,
      email: result.email,
      image: result.image,
    };

    const token = await signJwtToken(jwtPayload);

    const response = NextResponse.json({ success: true, token });
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Error during login: ", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
