import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Fetch order and associated products from MongoDB
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { lineItems: true },
    });

    if (!order || !order.email) {
      return NextResponse.json(
        { error: "Order or customer email not found" },
        { status: 404 }
      );
    }

    // Construct product links
    const productLinks = order.lineItems.map((item) => {
      return `https://cultivated-reviews.vercel.app/product/${item.productHandle}`;
    });

    // Send email via Resend
    await resend.emails.send({
      from: "Cultivated Reviews <reviews@yourdomain.com>",
      to: order.email,
      subject: "How was your order? Leave us a review!",
      html: `
        <p>Hey ${order.customerName || "there"},</p>
        <p>Thanks for your recent order! We'd love to hear your feedback.</p>
        <p>Click below to review your products:</p>
        <ul>
          ${productLinks
            .map((link) => `<li><a href="${link}">${link}</a></li>`)
            .join("")}
        </ul>
        <p>As a thank you, you’ll receive 20% off your next purchase!</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to send review email:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
