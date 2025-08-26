"use client";
import { uploadReceipt } from "@/actions/uploadReceipt";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useSchematicEntitlement } from "@schematichq/schematic-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";

function DragAndDropZone() {
  // setup sensors for drag detection
  const sensors = useSensors(useSensor(PointerSensor));

  const { user } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const {
    value: isFeatureEnabled,
    featureUsage,
    featureUsageExceeded,
    featureAllocation,
  } = useSchematicEntitlement("scans");

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!user) {
        alert("Please sign in to upload files.");
        return;
      }

      const fileArray = Array.from(files);
      const receiptFiles = fileArray.filter(
        (file) =>
          file.type.includes("jpeg") ||
          file.type.includes("pdf") ||
          file.name.toLowerCase().endsWith(".pdf") ||
          file.name.toLowerCase().endsWith(".jpg") ||
          file.name.toLowerCase().endsWith(".jpeg"),
      );

      if (receiptFiles.length === 0) {
        alert("Please upload valid receipt files; which are PDF or JPEG.");
        return;
      }

      setIsUploading(true);

      try {
        const newUploadedFiles: string[] = [];

        for (const file of receiptFiles) {
          const formData = new FormData();
          formData.append("file", file);
          // formData.append("userId", user.id);

          const response = await uploadReceipt(formData);

          if (!response.success) {
            throw new Error(response.error);
          }

          // const data = await response.json();
          newUploadedFiles.push(file.name);
        }

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
        // alert(`Successfully uploaded ${newUploadedFiles.length} files.`);

        setTimeout(() => {
          setUploadedFiles([]);
        }, 5000);
        router.push("/receipts");
      } catch (error) {
        console.error("Upload failed", error);
        alert(
          `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setIsUploading(false);
      }
    },
    [user, router],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDraggingOver(false);

      // defensive check
      if (!user) {
        alert("Please sign in to upload files.");
        return;
      }

      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        handleUpload(event.dataTransfer.files);
      }
    },
    [user, handleUpload],
  );

  const isUserSignedIn = !!user;
  const canUpload = isUserSignedIn && isFeatureEnabled;

  return (
    <DndContext sensors={sensors}>
      <div className="w-full max-w-md mx-auto">
        <div
          onDragOver={canUpload ? handleDragOver : undefined}
          onDragLeave={canUpload ? handleDragLeave : undefined}
          onDrop={canUpload ? handleDrop : (e) => e.preventDefault()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            {
              "border-indigo-500 bg-indigo-50": isDraggingOver,
              "border-gray-300": !isDraggingOver,
              "opacity-70 cursor-not-allowed": !canUpload,
            },
          )}
        ></div>
      </div>
    </DndContext>
  );
}

export default DragAndDropZone;
