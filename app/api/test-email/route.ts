// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // Add this to your .env.local

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    await resend.emails.send({
      from: "hello@onboarding.resend.dev", // Resend's test domain
      to,
      subject: "🧪 Test Email from Resend",
      html: `<p>This is a test email sent from <strong>localhost</strong> via Resend onboarding domain.</p>`,
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
