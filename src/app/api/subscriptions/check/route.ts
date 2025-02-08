import db from "@/db/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const fieldId = searchParams.get("fieldId");

    if (!userId || !fieldId) return NextResponse.json({ isSubscribed: false });

    const existingSubscription = await db.userSubscription.findFirst({
      where: { userId, fieldId },
    });

    return NextResponse.json({ isSubscribe: !!existingSubscription });
  } catch (error) {
    console.error("Error checking subscription: ", error);
    return NextResponse.json({ isSubscribed: false });
  }
}
