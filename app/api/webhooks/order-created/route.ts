// app/api/webhooks/order-created/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { enqueueReviewReminder } from "@/lib/sendReviewReminder";

const SHOPIFY_WEBHOOOK_SECRET = process.env.SHOPIFY_WEBHOOOK_SECRET!;
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "tv-testing-tutorial.myshopify.com";

// Add this helper to get product by ID
async function getProductFromShopify(productId: string) {
  const res = await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/admin/api/2024-10/products/${productId}.json`,
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    console.warn(`❌ Failed to fetch product ${productId}`);
    return null;
  }

  const data = await res.json();
  return data.product;
}

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
    .createHmac("sha256", SHOPIFY_WEBHOOOK_SECRET)
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

    const lineItemsData = await Promise.all(
      order.line_items.map(async (item: any) => {
        let productImage = null;
        let productHandle = null;

        if (item.product_id) {
          const product = await getProductFromShopify(item.product_id);
          productImage = product?.image?.src || null;
          productHandle = product?.handle || null;
        }

        return {
          title: item.title,
          productId: item.product_id?.toString() || null,
          variantId: item.variant_id?.toString() || null,
          productHandle,
          image: productImage,
          quantity: item.quantity || 1,
        };
      })
    );

    const savedOrder = await prisma.order.create({
      data: {
        shopifyOrderId: orderId, // ✅ Fix here
        email,
        customerId,
        lineItems: {
          create: lineItemsData,
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
