import { useState, useRef } from "react";
import { Paperclip, Upload, FileText, Image, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileUpload: (file: File, fileUrl: string) => void;
}

export const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      onFileUpload(file, fileUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.includes('pdf') || fileType.includes('text') || fileType.includes('markdown')) return FileText;
    return File;
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleButtonClick}
        className="h-8 w-8 p-0 hover:bg-muted"
        title="Upload file"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.txt,.md,.json,.csv"
        onChange={handleFileChange}
      />

      {/* Drag and drop overlay (only shows when dragging) */}
      {isDragging && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-card p-8 rounded-lg border-2 border-dashed border-primary animate-glow-pulse">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">Drop your file here</p>
              <p className="text-sm text-muted-foreground">Supports images, PDFs, text, and markdown files</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};