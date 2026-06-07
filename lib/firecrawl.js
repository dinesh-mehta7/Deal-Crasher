import Firecrawl from "@mendable/firecrawl-js";

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  if (!url) {
    throw new Error("URL is required");
  }

  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json", // ✅ REQUIRED
          prompt:
            "Extract productName, currentPrice (number), currencyCode (INR, USD, etc), and productImageUrl",
          schema: {
            type: "object",
            required: ["productName", "currentPrice"],
            properties: {
              productName: { type: "string" },
              currentPrice: { type: "number" },
              currencyCode: { type: "string" },
              productImageUrl: { type: "string" },
            },
          },
        },
      ],
    });

    const data = result?.data?.json || result?.json;

    if (!data) {
      throw new Error("No data returned from Firecrawl");
    }

    if (!data.productName || !data.currentPrice) {
      throw new Error("Incomplete product data");
    }

    return {
      productName: data.productName,
      currentPrice: Number(data.currentPrice),
      currencyCode: data.currencyCode || "INR",
      productImageUrl: data.productImageUrl || null,
    };
  } catch (error) {
    console.error("🔥 Firecrawl error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}