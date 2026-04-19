// import Firecrawl from '@mendable/firecrawl-js';
// const app = new Firecrawl({ apiKey: 'process.env.FIRECRAWL_API_KEY' });
// export async function scrapeProduct(url) {
//     try {
//         const result = await firecrawl.scrape(url, {
//             formats: [
//                 {
//                     type: "json",
//                     schema: {
//                         type: "object",
//                         required: ["productName", "currentPrice"],
//                         properties: {
//                             productName: { type: "string" },
//                             currentPrice: { type: "number" },
//                             currencyCode: { type: "string" },
//                             productImageUrl: { type: "string" },
//                         },
//                     },
//                 },
//             ],
//             prompt:
//                 "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available",
//         });

// // Firecrawl returns data in result.extract
// const extractedData = result.json;

// if (!extractedData || !extractedData.productName) {
//     throw new Error("No data extracted from URL");
// }

// return extractedData;
//   } catch (error) {
//     console.error("Firecrawl scrape error:", error);
//     throw new Error(`Failed to scrape product: ${error.message}`);
// }
// }


// import Firecrawl from '@mendable/firecrawl-js';

// const app = new Firecrawl({ apiKey: 'fc-YOUR-API-KEY' });

// // 1. Scrape Amazon's homepage
// const result = await app.scrape('https://www.amazon.com', { formats: ['markdown'] });
// const scrapeId = result.metadata?.scrapeId;

// // 2. Interact — search for a product and get its price
// await app.interact(scrapeId, { prompt: 'Search for iPhone 16 Pro Max' });
// const response = await app.interact(scrapeId, { prompt: 'Click on the first result and tell me the price' });
// console.log(response.output);

// // 3. Stop the session
// await app.stopInteraction(scrapeId);
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