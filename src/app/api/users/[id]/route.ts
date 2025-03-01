import db from "@/db/db";
import { NotFoundError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
