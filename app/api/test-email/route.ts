// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // Use a secure token

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    await resend.emails.send({
      from: "hello@emails.teevong.com", // ✅ Your custom verified domain
      to,
      subject: "🧪 Test Email from Resend via emails.teevong.com",
      html: `<p>This is a test email sent from <strong>emails.teevong.com</strong> via Resend.</p>`,
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
