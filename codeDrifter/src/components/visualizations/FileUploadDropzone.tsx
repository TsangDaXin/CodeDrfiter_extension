import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  content: string;
  type: 'file' | 'folder';
  path: string;
}

interface FileUploadDropzoneProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export const FileUploadDropzone = ({ onFilesUploaded }: FileUploadDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFiles = async (fileList: FileList) => {
    setIsUploading(true);
    const files: UploadedFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Only process code files
      if (isCodeFile(file.name)) {
        try {
          const content = await readFileContent(file);
          files.push({
            name: file.name,
            content,
            type: 'file',
            path: file.webkitRelativePath || file.name
          });
        } catch (error) {
          console.error(`Error reading file ${file.name}:`, error);
        }
      }
    }
    
    if (files.length > 0) {
      onFilesUploaded(files);
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} code files processed`,
      });
    } else {
      toast({
        title: "No code files found",
        description: "Please upload files with supported extensions (.js, .ts, .py, .java, etc.)",
        variant: "destructive"
      });
    }
    
    setIsUploading(false);
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const isCodeFile = (filename: string): boolean => {
    const codeExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs',
      '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.dart', '.vue',
      '.html', '.css', '.scss', '.sass', '.less', '.json', '.yaml', '.yml',
      '.md', '.txt', '.sql', '.sh', '.bash', '.ps1', '.r', '.scala', '.clj'
    ];
    return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext));
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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-border hover:border-primary/50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {isUploading ? 'Processing files...' : 'Drop your code files here'}
        </h3>
        <p className="text-muted-foreground mb-4">
          Or click to browse and select files
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span>Supports:</span>
          <span className="bg-muted px-2 py-1 rounded">JS/TS</span>
          <span className="bg-muted px-2 py-1 rounded">Python</span>
          <span className="bg-muted px-2 py-1 rounded">Java</span>
          <span className="bg-muted px-2 py-1 rounded">C++</span>
          <span className="bg-muted px-2 py-1 rounded">+more</span>
        </div>
      </div>

      {/* Upload Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Select Files
        </Button>
        
        <Button
          variant="outline"
          onClick={() => folderInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Folder className="h-4 w-4" />
          Select Folder
        </Button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt,.dart,.vue,.html,.css,.scss,.sass,.less,.json,.yaml,.yml,.md,.txt,.sql,.sh,.bash,.ps1,.r,.scala,.clj"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <input
        ref={folderInputRef}
        type="file"
        {...({ webkitdirectory: "" } as any)}
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};