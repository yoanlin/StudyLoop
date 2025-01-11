import db from "@/db/db";
import { SignUpSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

// Sign Up
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = SignUpSchema.safeParse(body);

    if (!validatedData.success) {
      throw new Error("The data is not validated");
    }

    const { email, name, username } = validatedData.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) throw new Error("Username already exists");

    const newUser = await db.user.create({
      data: {
        email,
        name,
        username,
      },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error registering user" },
      { status: 500 }
    );
  }
}
