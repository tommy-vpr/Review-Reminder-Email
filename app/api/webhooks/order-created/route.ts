// app/api/webhooks/order-created/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { enqueueReviewReminder } from "@/lib/sendReviewReminder";

const SHOPIFY_SECRET = process.env.SHOPIFY_WEBHOOOK_SECRET!;
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "tv-testing-tutorial.myshopify.com";

function getCorsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Shopify-Hmac-Sha256",
    "Access-Control-Allow-Credentials": "true",
  };
}

function isValidShopifyWebhook(req: Request, rawBody: string): boolean {
  const hmac = req.headers.get("x-shopify-hmac-sha256") || "";
  const digest = crypto
    .createHmac("sha256", SHOPIFY_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || ALLOWED_ORIGIN;
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin") || ALLOWED_ORIGIN;
  const rawBody = await req.text();

  if (!isValidShopifyWebhook(req, rawBody)) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid webhook signature" }),
      {
        status: 401,
        headers: getCorsHeaders(origin),
      }
    );
  }

  try {
    const order = JSON.parse(rawBody);

    const orderId = order.id.toString();
    const email = order.email;
    const customerId = order.customer?.id?.toString() || null;

    const savedOrder = await prisma.order.create({
      data: {
        shopifyOrderId: orderId, // ✅ Fix here
        email,
        customerId,
        lineItems: {
          create: order.line_items.map((item: any) => ({
            title: item.title,
            productId: item.product_id?.toString() || null,
            variantId: item.variant_id?.toString() || null,
            productHandle:
              item.title?.toLowerCase().replace(/\s+/g, "-") || null,
            quantity: item.quantity || 1,
          })),
        },
      },
    });

    await enqueueReviewReminder(savedOrder.id);

    return new NextResponse(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  } catch (err) {
    console.error("❌ Order webhook error:", err);
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: getCorsHeaders(origin),
    });
  }
}
