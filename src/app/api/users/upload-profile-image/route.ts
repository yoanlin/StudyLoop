import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import db from "@/db/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const formdata = await req.formData();
    const file = formdata.get("file") as File;
    const userId = formdata.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid data" } },
        { status: 400 }
      );
    }

    if (session.user.id !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Forbidden: Cannot update another user's profile" },
        },
        { status: 403 }
      );
    }

    const blob = await put(`profile-images/${userId}-${Date.now()}`, file, {
      access: "public",
    });

    if (!blob.url) throw new Error("Upload failed");

    await db.user.update({
      where: { id: userId },
      data: { image: blob.url },
    });

    return NextResponse.json({ success: true, imageUrl: blob.url });
  } catch (error) {
    console.error("Upload error: ", error);
    return NextResponse.json(
      { success: false, error: { message: "Upload faiied" } },
      { status: 500 }
    );
  }
}
