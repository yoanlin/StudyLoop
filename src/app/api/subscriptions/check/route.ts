import db from "@/db/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const fieldId = searchParams.get("fieldId");

    if (!userId || !fieldId)
      return NextResponse.json({
        success: false,
        error: { message: "Invalid input" },
      });

    const existingSubscription = await db.userSubscription.findFirst({
      where: { userId, fieldId },
    });

    return NextResponse.json({
      success: true,
      data: { isSubscribed: !!existingSubscription },
    });
  } catch (error) {
    console.error("Error checking subscription: ", error);
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
