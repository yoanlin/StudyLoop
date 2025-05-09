import db from "@/db/db";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { AccountSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

const ProviderAccountIdSchema = AccountSchema.pick({ providerAccountId: true });

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  try {
    const validatedData = ProviderAccountIdSchema.safeParse({
      providerAccountId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const account = await db.account.findFirst({
      where: { providerAccountId },
    });

    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
