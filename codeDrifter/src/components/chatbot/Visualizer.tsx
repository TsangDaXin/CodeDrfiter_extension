import { useState, useEffect, useRef } from "react";
import { BarChart3, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mermaid from 'mermaid';

const diagramTypes = {
  flowchart: {
    title: "API Flow",
    code: `flowchart TD
    A[User Request] --> B{Authentication}
    B -->|Valid| C[Process Request]
    B -->|Invalid| D[Return Error]
    C --> E[Database Query]
    E --> F[Format Response]
    F --> G[Return Data]
    D --> H[End]
    G --> H`
  },
  sequence: {
    title: "User Registration",
    code: `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    
    U->>F: Fill registration form
    F->>A: POST /register
    A->>D: Save user data
    D-->>A: User created
    A-->>F: Success response
    F-->>U: Registration complete`
  },
  class: {
    title: "Documentation Schema",
    code: `classDiagram
    class Document {
        +String id
        +String title
        +String content
        +Date created
        +Date updated
        +create()
        +update()
        +delete()
    }
    
    class User {
        +String id
        +String name
        +String email
        +login()
        +logout()
    }
    
    class Comment {
        +String id
        +String content
        +Date created
    }
    
    User ||--o{ Document : creates
    Document ||--o{ Comment : has`
  }
};

export const Visualizer = () => {
  const [selectedDiagram, setSelectedDiagram] = useState<string>("flowchart");
  const [isRendering, setIsRendering] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#4fd1c7',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#4fd1c7',
        lineColor: '#6b7280',
        secondaryColor: '#374151',
        tertiaryColor: '#1f2937'
      }
    });
  }, []);

  const renderDiagram = async (diagramCode: string) => {
    if (!diagramRef.current) return;
    
    setIsRendering(true);
    
    try {
      const id = `mermaid-${Date.now()}`;
      diagramRef.current.innerHTML = `<div id="${id}">${diagramCode}</div>`;
      
      await mermaid.init(undefined, `#${id}`);
    } catch (error) {
      console.error('Mermaid rendering error:', error);
      if (diagramRef.current) {
        diagramRef.current.innerHTML = '<p class="text-destructive text-xs">Error rendering diagram</p>';
      }
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    const diagram = diagramTypes[selectedDiagram as keyof typeof diagramTypes];
    if (diagram) {
      renderDiagram(diagram.code);
    }
  }, [selectedDiagram]);

  const handleDownload = () => {
    const svg = diagramRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${selectedDiagram}-diagram.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="mt-2 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Diagram Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedDiagram} onValueChange={setSelectedDiagram}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flowchart" className="text-xs">Flow</TabsTrigger>
            <TabsTrigger value="sequence" className="text-xs">Sequence</TabsTrigger>
            <TabsTrigger value="class" className="text-xs">Schema</TabsTrigger>
          </TabsList>
          
          {Object.entries(diagramTypes).map(([key, diagram]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{diagram.title}</h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => renderDiagram(diagram.code)}
                      disabled={isRendering}
                      className="h-7 px-2"
                    >
                      {isRendering ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      className="h-7 px-2"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Diagram Render Area */}
                <div className="bg-muted rounded-lg p-4 min-h-[200px] overflow-auto">
                  <div ref={diagramRef} className="w-full h-full flex items-center justify-center">
                    {isRendering && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Rendering diagram...
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  ✨ Interactive diagram showing {diagram.title.toLowerCase()} visualization
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};