import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  const iframeUrl = `http://localhost:3000/?api=true&key=${key}`;
  return NextResponse.json({ iframeUrl, key });
}
