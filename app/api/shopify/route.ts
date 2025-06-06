import { NextRequest, NextResponse } from "next/server";
import { fetchProductById } from "@/app/actions/fetchProductById"; // adjust path if needed

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("id");

  if (!productId) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  try {
    const product = await fetchProductById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("❌ API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
