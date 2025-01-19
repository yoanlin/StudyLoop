import db from "@/db/db";
import { ValidationError } from "@/lib/errors";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

// create user
export async function POST(request: Request) {
  const body = await request.json();
  console.log("Received Data:", body);
  try {
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { email, username } = validatedData.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const existingUsername = await db.user.findUnique({ where: { username } });
    if (existingUsername) throw new Error("Username alreadt exists");

    const newUser = await db.user.create({ data: validatedData.data });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
