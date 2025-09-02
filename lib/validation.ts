export function isAllowedFile(file: File): boolean {
  const allowedExtensions = /\.(jpg|jpeg|png|gif|pdf)$/i;
  return (
    (file.type.startsWith("image/") ||
      file.type.startsWith("application/pdf")) &&
    allowedExtensions.test(file.name)
  );
}
