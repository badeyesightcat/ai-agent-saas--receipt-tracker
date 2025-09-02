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
import { AlertCircle, CheckCircle, CloudUpload } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";
import { Button } from "./ui/button";
import { isAllowedFile } from "@/lib/validation";

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
      const receiptFiles = fileArray.filter((file) => isAllowedFile(file));

      if (receiptFiles.length === 0) {
        alert(
          "Please upload valid receipt files; which are GIF, PNG, JPEG or PDF.",
        );
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

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        handleUpload(event.target.files);
      }
    },
    [handleUpload],
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p>Uploading...</p>
            </div>
          ) : !isUserSignedIn ? (
            <>
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to upload files.
              </p>
            </>
          ) : (
            <>
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop image files here, or click to select files
              </p>
              <input
                type="file"
                multiple
                accept="image/gif, image/png, image/jpeg, application/pdf"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInputChange}
              />
              <Button
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFeatureEnabled}
                onClick={triggerFileInput}
              >
                {isFeatureEnabled ? "Select files" : "Upgrade to upload"}
              </Button>
            </>
          )}
        </div>

        {featureUsageExceeded && (
          <div className="mt-4">
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>
                You have exceeded your limits of {featureAllocation} scans.
                Please upgrade to continue.
              </span>
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium">Uploaded Files:</h3>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              {uploadedFiles.map((fileName, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  {fileName}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/*  */}
      </div>
    </DndContext>
  );
}

export default DragAndDropZone;
