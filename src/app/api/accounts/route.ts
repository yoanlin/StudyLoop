import db from "@/db/db";
import { ForbiddenError, ValidationError } from "@/lib/errors";
import { AccountSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

// create account
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = AccountSchema.safeParse(body);

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const existingAccount = await db.account.findFirst({
      where: {
        provider: validatedData.data.provider,
        providerAccountId: validatedData.data.providerAccountId,
      },
    });

    if (existingAccount)
      throw new ForbiddenError(
        "An account with the same provider already exist"
      );

    const newAccount = await db.account.create({ data: validatedData.data });

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
