export async function fetchProductById(productId: string) {
  const GID = `gid://shopify/Product/${productId}`;

  try {
    const response = await fetch(process.env.SHOPIFY_ADMIN_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
            query GetProductById($id: ID!) {
              product(id: $id) {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
            }
          `,
        variables: { id: GID },
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error("❌ Shopify GraphQL error:", json.errors);
      return null;
    }

    return json.data.product;
  } catch (error) {
    console.error("❌ Failed to fetch product:", error);
    return null;
  }
}
