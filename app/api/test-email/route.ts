// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import TestEmailTemplate from "@/components/emails/TestEmailTemplate"; // your React email component

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    await resend.emails.send({
      from: "Teevong <noreply@emails.teevong.com>", // ✅ Your custom verified domain
      to,
      subject: "🧪 Test Email from Resend via emails.teevong.com",
      react: TestEmailTemplate(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Email send failed:", err);
    return NextResponse.json(
      { error: "Email failed to send" },
      { status: 500 }
    );
  }
}
