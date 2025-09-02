import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { anthropic } from "inngest";
import { z } from "zod";

const parseReceiptTool = createTool({
  name: "parse-receipt",
  description: "Analyzes the given receipt",
  parameters: z.object({
    receiptUrl: z.string(),
  }),
  handler: async ({ receiptUrl }, { step }) => {
    try {
      console.log("Received parameters for receipt parsing.", { receiptUrl });

      return await step?.ai.infer("parse-receipt", {
        model: anthropic({
          model: "claude-3-5-haiku-latest",
          defaultParameters: {
            max_tokens: 3094,
          },
        }),
        body: {
          messages: [
            {
              role: "user",
              content: [
                { type: "document", source: { type: "url", url: receiptUrl } },
                {
                  type: "text",
                  text: `Extract the data from the receipt and return the structured output as follows:
                  {
                    "merchant": {
                      "name": "Store name",
                      "address": "123 Main St, City, Country",
                      "contact": "+123456789"
                    },
                    "transaction": {
                      "date": "YYYY-MM-DD",
                      "receipt_number": "ABC123456",
                      "payment_method": "Credit card",
                    },
                    "items": [
                      {
                        "name": "Item 1",
                        "quantity": 2,
                        "unit_price": 1,100,
                        "total_price": 2,200,
  
                      }
                    ],
                    "totals": {
                      "taxable_price": 2,000,
                      "surtax": 200,
                      "duty_free_price": 3,000,
                      "total": 5,200,
                      "currency": "KRW"
                    }
                  }`,
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      console.error(error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const receiptScanningAgent = createAgent({
  name: "Receipt Scanning Agent",
  description:
    "Processes receipt images to extract key information such as vendor names, dates, amounts, and line items",
  system: `You are an AI-powered receipt scanning assistant. Your primary role is to accurately extract and structure relevant information from scanned receipts. Your task includes recognizing and parsing details such as:
        - Merchant Information: Store name, address, contact details
        - Transaction Details: Date, time, receipt number, payment method
        - Itemized Purchases: Product names, quantities, individual prices, discounts
        - Total Amounts: Subtotal, taxes, total paid, and any applied discounts
        - Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
        - Normalize dates, currency values, and formatting for consistency.
        - If any key details are missing or unclear, return a structured response indicating incomplete data.
        - Handle multiple formats, languages, and varying receipt layouts effectively.
        - Maintain a structured JSON output for easy integration with databases or expense tracking systems.`,
  model: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 3094,
    },
  }),
  tools: [parseReceiptTool],
});
