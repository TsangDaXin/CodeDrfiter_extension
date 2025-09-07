import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Code2, 
  Eye, 
  Maximize, 
  RefreshCw,
  Copy,
  Check,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mermaid from "mermaid";

interface DiagramData {
  id: string;
  title: string;
  type: string;
  code: string;
  description: string;
}

interface InteractiveDiagramProps {
  diagram: DiagramData;
}

export const InteractiveDiagram = ({ diagram }: InteractiveDiagramProps) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'code'>('diagram');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#4fd1c7',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#4fd1c7',
        lineColor: '#4fd1c7',
        secondaryColor: '#374151',
        tertiaryColor: '#1f2937',
        background: '#1f2937',
        mainBkg: '#374151',
        secondBkg: '#4b5563',
        tertiaryBkg: '#6b7280'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        useMaxWidth: true,
        showSequenceNumbers: true
      },
      gitGraph: {
        useMaxWidth: true
      }
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'diagram') {
      renderDiagram();
    }
  }, [diagram.code, activeTab]);

  const renderDiagram = async () => {
    if (!diagramRef.current) return;
    
    setIsRendering(true);
    
    try {
      // Clear previous content and reset mermaid
      diagramRef.current.innerHTML = '';
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#4fd1c7',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#4fd1c7',
          lineColor: '#4fd1c7',
          secondaryColor: '#374151',
          tertiaryColor: '#1f2937',
          background: '#1f2937',
          mainBkg: '#374151',
          secondBkg: '#4b5563',
          tertiaryBkg: '#6b7280'
        },
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        sequence: {
          useMaxWidth: true,
          showSequenceNumbers: true,
          wrap: true
        },
        gitGraph: {
          useMaxWidth: true
        }
      });
      
      // Create unique ID for this render
      const uniqueId = `mermaid-${diagram.id}-${Date.now()}`;
      
      // Render with mermaid
      const { svg } = await mermaid.render(uniqueId, diagram.code);
      
      if (svg && svg.trim()) {
        diagramRef.current.innerHTML = svg;
        
        // Style the SVG element
        const svgElement = diagramRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.background = 'transparent';
        }
      } else {
        throw new Error('Empty SVG generated');
      }
      
    } catch (error) {
      console.error('Error rendering diagram:', error);
      
      // Show fallback with the diagram code
      diagramRef.current.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div class="text-destructive">
            <svg class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="font-medium text-foreground">Diagram Preview Unavailable</p>
            <p class="text-sm text-muted-foreground mt-1">The diagram code is valid but preview rendering failed</p>
          </div>
          
          <div class="bg-muted rounded-lg p-4 max-w-lg">
            <p class="text-sm text-muted-foreground mb-2">Diagram Type: <span class="font-medium text-foreground">${diagram.type}</span></p>
            <p class="text-sm text-muted-foreground">Switch to the "Code" tab to view and copy the diagram syntax.</p>
          </div>
          
          <div class="text-xs text-muted-foreground bg-accent/20 p-3 rounded">
            💡 This diagram code can be used in any Mermaid-compatible tool or documentation system
          </div>
        </div>
      `;
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownload = () => {
    const svg = diagramRef.current?.querySelector('svg');
    if (!svg) return;

    // Download as SVG
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = `${diagram.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
    link.click();
    
    URL.revokeObjectURL(svgUrl);
    
    toast({
      title: "Diagram downloaded",
      description: "SVG file saved successfully",
    });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(diagram.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Code copied",
        description: "Diagram code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flowchart': return 'bg-blue-500/20 text-blue-400';
      case 'sequence': return 'bg-green-500/20 text-green-400';
      case 'gitgraph': return 'bg-purple-500/20 text-purple-400';
      case 'graph': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={`feature-card glow-border ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">{diagram.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{diagram.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(diagram.type)}>
              {diagram.type}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
              >
                <Maximize className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={renderDiagram}
                disabled={isRendering}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${isRendering ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="diagram" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Diagram
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="diagram" className="mt-4 px-6 pb-6">
            <div className={`bg-muted rounded-lg p-6 ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'min-h-[400px]'} overflow-auto`}>
              {isRendering ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Rendering diagram...
                  </div>
                </div>
              ) : (
                <div 
                  ref={diagramRef} 
                  className="w-full h-full flex items-center justify-center"
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-4 px-6 pb-6">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-8 px-3"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              
              <pre className={`bg-muted rounded-lg p-4 overflow-x-auto text-sm ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'max-h-96'}`}>
                <code className="text-foreground font-mono">
                  {diagram.code}
                </code>
              </pre>
            </div>
            
            <div className="mt-4 p-3 bg-accent/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Copy this code to use in your own documentation or modify it to create custom diagrams.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};