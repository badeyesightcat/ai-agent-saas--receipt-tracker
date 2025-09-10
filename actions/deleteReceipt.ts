"use server";

import convex from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Server action to delete a receipt by its ID
 * @param receiptId - The ID of the receipt to delete
 */

export async function deleteReceipt(receiptId: Id<"receipts">) {
  const user = await currentUser();
  console.log("Current user in deleteReceipt action:", user);

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    await convex.mutation(api.receipts.deleteReceipt, {
      receiptId: receiptId as Id<"receipts">,
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
