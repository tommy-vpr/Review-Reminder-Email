import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define type for line item
type LineItem = {
  productHandle: string;
};

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

    // Send email via Resend
    await resend.emails.send({
      from: "Teevong <noreply@emails.teevong.com>",
      to: order.email,
      subject: "How was your order? Leave us a review!",
      html: `
        <p>Hey ${order.customerName || "there"},</p>
        <p>Thanks for your recent order! We'd love to hear your feedback.</p>
        <p>Click below to review your products:</p>
        <ul>
  ${order.lineItems
    .filter((item) => item.productHandle)
    .map(
      (item) => `
    <li style="margin-bottom: 12px;">
      <a href="https://www.teevong.com/products/${item.productHandle}" target="_blank" style="display: flex; align-items: center; text-decoration: none;">
        <img src="${item.image}" alt="${item.title}" width="60" height="60" style="border-radius: 6px; margin-right: 12px;" />
        <span>${item.title}</span>
      </a>
    </li>`
    )
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
