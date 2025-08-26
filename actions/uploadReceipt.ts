"use server";

import { currentUser } from "@clerk/nextjs/server";

function isAllowedFile(file: File): boolean {
  const allowedExtensions = /\.(jpg|jpeg|png|gif)$/i;
  return file.type.startsWith("image/") && allowedExtensions.test(file.name);
}

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
        error: "Invalid file type. Only image files are allowed.",
      };
    }
  } catch (error) {
    console.error("Server action upload error:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
