import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import db from "@/db/db";

export async function POST(req: Request) {
  try {
    const formdata = await req.formData();
    const file = formdata.get("file") as File;
    const userId = formdata.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
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
      { success: false, error: "Upload faiied" },
      { status: 500 }
    );
  }
}
