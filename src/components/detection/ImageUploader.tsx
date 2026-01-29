import { useRef } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  disabled?: boolean;
}

const ImageUploader = ({ onImageSelect, disabled }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
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
  } = useImageUpload();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUploadClick = () => {
    if (file && preview) {
      onImageSelect(file, preview);
    }
  };

  return (
    <div className="w-full space-y-4">
      {!preview ? (
        <div
          className={cn(
            "upload-zone cursor-pointer relative overflow-hidden",
            isDragging && "dragging",
            disabled && "opacity-50 pointer-events-none"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Upload className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">
                Drop your image here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse from your device
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>JPG, PNG • Max 10MB</span>
            </div>
          </div>

          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-accent/10 backdrop-blur-sm">
              <p className="text-lg font-medium text-accent">Drop to upload</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30">
            <img
              src={preview}
              alt="Selected image preview"
              className="w-full h-auto max-h-[400px] object-contain"
            />
            <button
              onClick={reset}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <ImageIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {file?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {file && (file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button onClick={handleUploadClick} disabled={disabled}>
              Analyze Image
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
