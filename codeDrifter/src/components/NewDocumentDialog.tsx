import { useState } from "react";
import { 
  Upload, 
  FolderOpen, 
  Github, 
  FileText, 
  ChevronRight,
  Loader2,
  Check,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NewDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (documentId: string) => void;
}

type CreationMethod = 'upload' | 'ide' | 'github' | null;
type CreationStep = 'select' | 'configure' | 'generate' | 'complete';

export const NewDocumentDialog = ({
  isOpen,
  onClose,
  onDocumentCreated
}: NewDocumentDialogProps) => {
  const [selectedMethod, setSelectedMethod] = useState<CreationMethod>(null);
  const [currentStep, setCurrentStep] = useState<CreationStep>('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [description, setDescription] = useState('');

  const creationOptions = [
    {
      id: 'ide' as CreationMethod,
      title: 'Choose from Local IDE',
      description: 'Select files and folders from your development environment',
      icon: FolderOpen,
      gradient: 'from-blue-500 to-cyan-500',
      features: ['IntelliSense Integration', 'Live File Sync', 'Project Structure Analysis']
    },
    {
      id: 'upload' as CreationMethod,
      title: 'Upload Files/Folders',
      description: 'Upload files or entire folders from your device',
      icon: Upload,
      gradient: 'from-purple-500 to-pink-500',
      features: ['Drag & Drop Support', 'Bulk Upload', 'Automatic Detection']
    },
    {
      id: 'github' as CreationMethod,
      title: 'GitHub Repository',
      description: 'Import and analyze code from any GitHub repository',
      icon: Github,
      gradient: 'from-green-500 to-emerald-500',
      features: ['Repository Analysis', 'Commit History', 'Auto Documentation']
    }
  ];

  const handleMethodSelect = (method: CreationMethod) => {
    setSelectedMethod(method);
    setCurrentStep('configure');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
  };

  const handleGenerate = async () => {
    setCurrentStep('generate');
    setIsGenerating(true);
    
    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    setCurrentStep('complete');
    
    // Create a new document ID and navigate to it after a brief delay
    setTimeout(() => {
      const newDocId = `doc-${Date.now()}`;
      onDocumentCreated(newDocId);
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setCurrentStep('select');
    setGithubUrl('');
    setUploadedFiles([]);
    setDocumentTitle('');
    setDescription('');
    setIsGenerating(false);
    onClose();
  };

  const renderSelectMethod = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Choose Your Documentation Source
        </h3>
        <p className="text-muted-foreground text-sm">
          Select how you'd like to create your documentation
        </p>
      </div>

      <div className="grid gap-4">
        {creationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg glow-border group"
              onClick={() => handleMethodSelect(option.id)}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-lg bg-gradient-to-r transition-transform duration-300 group-hover:scale-110",
                  option.gradient
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{option.title}</h4>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{option.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderConfigureMethod = () => {
    const selectedOption = creationOptions.find(opt => opt.id === selectedMethod);
    if (!selectedOption) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={cn(
            "p-2 rounded-lg bg-gradient-to-r",
            selectedOption.gradient
          )}>
            <selectedOption.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{selectedOption.title}</h3>
            <p className="text-muted-foreground text-sm">{selectedOption.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {selectedMethod === 'github' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="github-url">Repository URL</Label>
                <Input
                  id="github-url"
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
            </>
          )}

          {selectedMethod === 'upload' && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select Files or Folders</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Drop files here or click to browse</p>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose Files
                </Button>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Selected {uploadedFiles.length} files
                  </p>
                  <div className="max-h-32 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="text-xs text-muted-foreground py-1">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedMethod === 'ide' && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>IDE Integration:</strong> Connect your development environment to automatically sync files and track changes.
                </p>
                <Button variant="outline" size="sm">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Connect IDE Workspace
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="doc-title">Documentation Title</Label>
            <Input
              id="doc-title"
              placeholder="Enter documentation title..."
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this documentation covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border resize-none h-20"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep('select')}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={
              (selectedMethod === 'github' && !githubUrl) ||
              (selectedMethod === 'upload' && uploadedFiles.length === 0) ||
              !documentTitle
            }
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            Generate Documentation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderGeneration = () => (
    <div className="text-center py-8">
      <div className="mb-6">
        {isGenerating ? (
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
        ) : (
          <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {isGenerating ? 'Analyzing & Generating...' : 'Documentation Ready!'}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-6">
        {isGenerating 
          ? 'Processing your files and generating comprehensive documentation'
          : 'Your documentation has been successfully generated and is ready for editing'
        }
      </p>

      {isGenerating && (
        <div className="space-y-2 text-xs text-muted-foreground max-w-md mx-auto">
          <div className="flex justify-between">
            <span>Scanning files...</span>
            <span>✓</span>
          </div>
          <div className="flex justify-between">
            <span>Analyzing code structure...</span>
            <span>✓</span>
          </div>
          <div className="flex justify-between">
            <span>Generating documentation...</span>
            <Loader2 className="h-3 w-3 animate-spin" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create New Documentation
          </DialogTitle>
          <DialogDescription>
            Transform your code into comprehensive, interactive documentation
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {currentStep === 'select' && renderSelectMethod()}
          {currentStep === 'configure' && renderConfigureMethod()}
          {(currentStep === 'generate' || currentStep === 'complete') && renderGeneration()}
        </div>
      </DialogContent>
    </Dialog>
  );
};