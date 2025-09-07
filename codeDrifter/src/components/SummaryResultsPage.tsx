import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Download,
  Upload,
  Share2,
  Edit3,
  Copy,
  FileText,
  Sparkles,
  Clock,
  TrendingUp,
  BarChart3,
  Loader2
} from "lucide-react";

interface SummaryResult {
  summary: string;
  compressionRatio: number;
  timeSaved: number;
  keyPoints: string[];
  originalLength: number;
  summaryLength: number;
}

interface SummaryResultsPageProps {
  result: SummaryResult;
  onBack: () => void;
  onEdit: () => void;
}

export const SummaryResultsPage = ({ result, onBack, onEdit }: SummaryResultsPageProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"markdown" | "pdf" | "docx" | "txt">("markdown");
  const [selectedPlatform, setSelectedPlatform] = useState<"notion" | "confluence" | "github" | "slack">("notion");

  const handleDownload = () => {
    toast({
      title: "📥 Download Started",
      description: `Downloading summary as ${selectedFormat.toUpperCase()}...`,
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "✅ Download Complete",
        description: "Summary has been downloaded successfully",
      });
    }, 2000);
  };

  const handleUpload = () => {
    toast({
      title: "📤 Upload Started",
      description: `Uploading to ${selectedPlatform}...`,
    });
    
    // Simulate upload
    setTimeout(() => {
      toast({
        title: "✅ Upload Complete",
        description: `Summary has been uploaded to ${selectedPlatform}`,
      });
    }, 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    toast({
      title: "🔄 Loading Editor",
      description: "Preparing document for editing...",
    });
    
    // Simulate loading and then navigate to documentation editor
    setTimeout(() => {
      setIsEditing(false);
      onEdit();
      toast({
        title: "📝 Editor Ready",
        description: "Document opened in Documentation Editor",
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "📋 Copied to Clipboard",
      description: "Summary copied successfully",
    });
  };

  const formats = [
    { id: "markdown", label: "Markdown (.md)", icon: FileText },
    { id: "pdf", label: "PDF Document", icon: FileText },
    { id: "docx", label: "Word Document", icon: FileText },
    { id: "txt", label: "Plain Text", icon: FileText }
  ];

  const platforms = [
    { id: "notion", label: "Notion", icon: Share2 },
    { id: "confluence", label: "Confluence", icon: Share2 },
    { id: "github", label: "GitHub Wiki", icon: Share2 },
    { id: "slack", label: "Slack Workspace", icon: Share2 }
  ];

  return (
    <div className="flex-1 bg-background overflow-y-auto custom-scrollbar">
      {/* Loading Overlay for Edit */}
      {isEditing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
                <Edit3 className="h-6 w-6 text-primary/60 absolute top-0 right-0 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Preparing Editor</h3>
                <p className="text-sm text-muted-foreground">Loading document in Documentation History...</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{width: "80%"}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="hover-scale"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Summary Results</h1>
              <p className="text-muted-foreground">Download, share, or edit your generated summary</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Generated
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Compression Ratio</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{result.compressionRatio}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reduced from {result.originalLength} to {result.summaryLength} characters
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Time Saved</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{result.timeSaved} min</p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on average reading speed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Key Points</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{result.keyPoints.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Essential insights extracted
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Content */}
          <div className="lg:col-span-2">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Generated Summary
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(result.summary)}
                      className="hover-scale"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleEdit}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">TL;DR Summary</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {result.summary}
                    </p>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <h4 className="font-medium text-foreground mb-3">Key Points Extracted</h4>
                    <ul className="space-y-2">
                      {result.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-primary">{index + 1}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <div className="space-y-6">
            {/* Download Options */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Download Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Select Format:</p>
                  <div className="space-y-2">
                    {formats.map((format) => (
                      <Button
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id as any)}
                        variant={selectedFormat === format.id ? "default" : "outline"}
                        className="w-full justify-start hover-scale"
                        size="sm"
                      >
                        <format.icon className="h-4 w-4 mr-2" />
                        {format.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleDownload} className="w-full bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download {selectedFormat.toUpperCase()}
                </Button>
              </CardContent>
            </Card>

            {/* Upload Options */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Share & Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Select Platform:</p>
                  <div className="space-y-2">
                    {platforms.map((platform) => (
                      <Button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id as any)}
                        variant={selectedPlatform === platform.id ? "default" : "outline"}
                        className="w-full justify-start hover-scale"
                        size="sm"
                      >
                        <platform.icon className="h-4 w-4 mr-2" />
                        {platform.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleUpload} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload to {platforms.find(p => p.id === selectedPlatform)?.label}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};