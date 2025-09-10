import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTemporaryDownloadLink(
  url: string | undefined,
  name: string,
) {
  if (url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "receipt.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    throw new Error("No download URL found");
  }
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatCurrency(amount: number, currency: string = ""): string {
  return `${amount.toFixed(2)}${currency ? ` ${currency}` : "WON"}`;
}

// Validate allowed file types (images and PDFs)
export function isAllowedFile(file: File): boolean {
  const allowedExtensions = /\.(jpg|jpeg|png|gif|pdf)$/i;
  return (
    (file.type.startsWith("image/") ||
      file.type.startsWith("application/pdf")) &&
    allowedExtensions.test(file.name)
  );
}
