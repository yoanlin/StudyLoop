import { NextResponse } from "next/server";

export async function GET() {
  // Mock session data to be returned
  const mockSession = {
    user: {
      id: "mock-user-123",
      email: "mockuser@example.com",
      name: "Mock User",
      image:
        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days expiration
  };

  console.log("Returning mock session data:", mockSession);
  return NextResponse.json(mockSession, { status: 200 });
}
