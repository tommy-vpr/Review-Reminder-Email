// app/api/queue/test-email/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { to } = await req.json();

  const res = await fetch(
    "https://qstash.upstash.io/v1/publish/https://www.teevong.com/api/test-email",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`,
        "Upstash-Delay": "60s", // delay 1 minute
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to }),
    }
  );

  if (res.ok) {
    return NextResponse.json({ success: true });
  } else {
    const error = await res.text();
    console.error("❌ QStash failed:", error);
    return NextResponse.json({ error: "QStash failed" }, { status: 500 });
  }
}
