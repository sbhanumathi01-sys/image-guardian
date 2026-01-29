import { useState, useCallback } from "react";

interface UseImageUploadReturn {
  file: File | null;
  preview: string | null;
  isDragging: boolean;
  error: string | null;
  handleFileSelect: (file: File) => void;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  reset: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const useImageUpload = (): UseImageUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please upload a JPG or PNG image.";
    }
    if (file.size > MAX_SIZE) {
      return "File size must be less than 10MB.";
    }
    return null;
  }, []);

  const handleFileSelect = useCallback((selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFile(selectedFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, [validateFile]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(null);
    setIsDragging(false);
  }, []);

  return {
    file,
    preview,
    isDragging,
    error,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    reset,
  };
};
