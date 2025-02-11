import db from "@/db/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const postId = searchParams.get("postId");
    if (!userId || !postId)
      return NextResponse.json({
        sucess: false,
        error: { message: "Invalid input" },
      });

    const existingCollection = await db.postCollector.findFirst({
      where: { postId, userId },
    });

    return NextResponse.json({
      success: true,
      data: { isSaved: !!existingCollection },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
