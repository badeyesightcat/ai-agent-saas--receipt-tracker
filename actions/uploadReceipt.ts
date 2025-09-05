"use server";

import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";
import { getFileDownloadUrl } from "./getFileDownloadUrl";
import { inngest } from "@/inngest/client";
import { Events } from "@/inngest/constants";
import { isAllowedFile } from "@/lib/validation";

/**
 * Server action to upload receipt file to Convex storage
 * @param formData - FormData containing the file to upload
 */
export async function uploadReceipt(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Get the file from the FormData
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate the file type
    if (!isAllowedFile(file)) {
      return {
        success: false,
        error: "Invalid file type. Only image files and PDF files are allowed.",
      };
    }

    // Get upload URL from Convex
    const uploadUrl = await convex.mutation(api.receipts.generateUploadUrl, {});

    // Convert the file to arrayBuffer for fetch API
    // [!important]
    // for uploading only, blob is Okay,
    // for using meta data and contents inside files, arraybuffer is needed
    const arrayBuffer = await file.arrayBuffer();

    // Upload the file to Convex storage
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      // [!important] Why not use arrayBuffer directly?
      // Because fetch API expects body to be of
      // type Blob, BufferSource, FormData, URLSearchParams, ReadableStream, or USVString.
      // arrayBuffer is of type ArrayBuffer which is not directly accepted.
      // So we convert it to Uint8Array which is a BufferSource.
      body: new Uint8Array(arrayBuffer),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    // Get the storage ID from the response
    const { storageId } = await uploadResponse.json();

    // Add receipt to the database
    const receiptId = await convex.mutation(api.receipts.storeReceipt, {
      userId: user.id,
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
      // fileDisplayName: formData.get("fileDisplayName") as string | null,
    });

    // Generate the file URL
    const fileUrlResponse = await getFileDownloadUrl(storageId);

    if (!fileUrlResponse.success) {
      throw new Error(fileUrlResponse.error || "Failed to generate file URL");
    }

    await inngest.send({
      name: Events.EXTRACT_DATA_FROM_RECEIPT_AND_SAVE_TO_DATABASE,
      data: {
        url: fileUrlResponse.downloadUrl,
        receiptId,
      },
    });

    return { success: true, data: { receiptId, fileName: file.name } }; //  fileUrl: fileUrl.downloadUrl
  } catch (error) {
    console.error("Server action upload error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
