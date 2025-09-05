import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Function to generate a Convex upload URL for the client
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate a URL that the client can use to upload a file
    return await ctx.storage.generateUploadUrl();
  },
});

// Store a receipt file and add it to the database
export const storeReceipt = mutation({
  args: {
    userId: v.string(),
    fileId: v.id("_storage"),
    fileName: v.string(),
    size: v.number(),
    mimeType: v.string(),
    // fileDisplayName: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args, // { userId, fileName, fileId, fileDisplayName, size, mimeType },
  ) => {
    const receipt = {
      userId: args.userId,
      fileName: args.fileName,
      //   fileDisplayName: args.fileName,
      fileId: args.fileId,
      uploadedAt: Date.now(),
      size: args.size,
      mimeType: args.mimeType,
      status: "pending",

      // Initialize extracted data fields as undefined
      merchantName: undefined,
      merchantAddress: undefined,
      merchantContact: undefined,
      transactionDate: undefined,
      transactionAmount: undefined,
      currency: undefined,
      //   receiptSummary: undefined,
      items: [],
    };

    // Insert the receipt into the database
    const receiptId = await ctx.db.insert("receipts", receipt);

    return receiptId; // return { ...receipt, _id: id };
  },
});

// Get receipts for a user, optionally filtered by status
export const getReceipts = query({
  args: {
    userId: v.string(), // [!important] this is needed due to its server component context
    // status: v.optional(v.string()), // "pending", "processed", "error"
  },
  handler: async (ctx, args) => {
    // { userId, status } = args
    // let q = ctx.db
    //   .query("receipts")
    //   .withIndex("byUser", (q) =>
    //     q.eq("userId", userId).orderBy("uploadedAt", "desc"),
    //   );
    // if (status) {
    //   q = q.filter((r) => r.status.equals(status));
    // }
    // return await q.collect();

    // Only return receipts for the authenticated user
    return await ctx.db
      .query("receipts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

// Functions to get a single receipt by ID
export const getReceiptById = query({
  args: { receiptId: v.id("receipts") },
  handler: async (ctx, args) => {
    const receipt = await ctx.db.get(args.receiptId);

    if (receipt) {
      const identity = await ctx.auth.getUserIdentity();
      console.log("User identity:", identity);
      if (!identity) {
        throw new Error("User not authenticated");
      }

      const userId = identity.subject; // [!important] Use subject prop due to its uniqueness othern than id prop
      if (receipt.userId !== userId) {
        throw new Error("Not authorized to access this receipt");
      }
    }
    // else {
    //   throw new Error("Receipt not found");
    // }

    return receipt;
  },
});

// Generate a URL to download a receipt file
export const getReceiptDownloadUrl = query({
  args: { fileId: v.id("_storage") }, // [!important] file is stored in Convex storage and is saved under _storage, not in receipts table. PAY ATTENTION TO THIS
  handler: async (ctx, args) => {
    // Get a temporary URL that can be used to download the file
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Update the status of a recceipt
export const updateReceiptStatus = mutation({
  args: { receiptId: v.id("receipts"), status: v.string() }, // "pending", "processed", "error"
  handler: async (ctx, args) => {
    // Verify user has access to this receipt
    const receipt = await ctx.db.get(args.receiptId);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const userId = identity.subject; // [!important] Use subject prop due to its uniqueness othern than id prop
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to update this receipt");
    }

    await ctx.db.patch(args.receiptId, { status: args.status });

    return true;
  },
});

// Delete a receipt and its file
export const deleteReceipt = mutation({
  args: { receiptId: v.id("receipts") },
  handler: async (ctx, args) => {
    // Verify user has access to this receipt
    const receipt = await ctx.db.get(args.receiptId);
    if (!receipt) {
      throw new Error("Receipt not found");
    }

    // Verify user has access to this receipt
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const userId = identity.subject; // [!important] Use subject prop due to its uniqueness othern than id prop
    if (receipt.userId !== userId) {
      throw new Error("Not authorized to delete this receipt");
    }

    // Delete the file from Convex storage
    await ctx.storage.delete(receipt.fileId);

    // Delete the receipt from the database
    await ctx.db.delete(args.receiptId);

    return true;
  },
});

/** public mutation acting as a gateway for server-to-server communication */
export const updateReceiptWithExtractedData = mutation({
  args: {
    receiptId: v.id("receipts"),
    userId: v.string(),
    secret: v.string(),
    fileDisplayName: v.string(),
    merchantName: v.string(),
    merchantAddress: v.string(),
    merchantContact: v.string(),
    transactionDate: v.string(),
    transactionAmount: v.string(),
    currency: v.string(),
    receiptSummary: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.INNGEST_SECRET) {
      throw new Error("Not authorized to update this receipt");
    }
    await ctx.runMutation(
      internal.receipts.internalUpdateReceiptWithExtractedData,
      {
        receiptId: args.receiptId,
        userId: args.userId,
        fileDisplayName: args.fileDisplayName,
        merchantName: args.merchantName,
        merchantAddress: args.merchantAddress,
        merchantContact: args.merchantContact,
        transactionDate: args.transactionDate,
        transactionAmount: args.transactionAmount,
        currency: args.currency,
        receiptSummary: args.receiptSummary,
        items: args.items,
      },
    );

    return { userId: args.userId };
  },
});

export const internalUpdateReceiptWithExtractedData = internalMutation({
  args: {
    receiptId: v.id("receipts"),
    userId: v.string(),
    fileDisplayName: v.string(),

    // Extracted data fields
    merchantName: v.string(),
    merchantAddress: v.string(),
    merchantContact: v.string(),
    transactionDate: v.string(),
    transactionAmount: v.string(),
    currency: v.string(),
    receiptSummary: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    /** The block below is commented out due to use of internal mutation. */
    // const receipt = await ctx.db.get(args.receiptId);
    // if (!receipt) {
    //   throw new Error("Receipt not found");
    // }

    // const identity = await ctx.auth.getUserIdentity();
    // console.log("Context received:", ctx.auth);
    // if (!identity) {
    //   throw new Error("User not authenticated");
    // }

    // const userId = identity.subject; // [!important] Use subject prop due to its uniqueness othern than id prop
    // if (receipt.userId !== userId) {
    //   throw new Error("Not authorized to update this receipt");
    // }

    await ctx.db.patch(args.receiptId, {
      fileDisplayName: args.fileDisplayName,
      merchantName: args.merchantName,
      merchantAddress: args.merchantAddress,
      merchantContact: args.merchantContact,
      transactionDate: args.transactionDate,
      transactionAmount: args.transactionAmount,
      currency: args.currency,
      receiptSummary: args.receiptSummary,
      items: args.items,
      status: "processed", // Update status to "processed" when data is extracted
    });

    // return { userId: receipt.userId };
  },
});
