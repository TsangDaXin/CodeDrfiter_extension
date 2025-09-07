import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  GitBranch, 
  Network, 
  FileText, 
  Code, 
  Play,
  CheckCircle,
  Circle
} from "lucide-react";

interface UploadedFile {
  name: string;
  content: string;
  type: 'file' | 'folder';
  path: string;
}

interface AnalysisConfig {
  scope: 'entire' | 'file' | 'function';
  selectedFiles: string[];
  selectedFunctions: string[];
  visualizationTypes: ('flowchart' | 'api-graph' | 'changelog' | 'architecture')[];
}

interface AnalysisOptionsProps {
  files: UploadedFile[];
  config: AnalysisConfig;
  onConfigChange: (config: AnalysisConfig) => void;
  onAnalyze: (config: AnalysisConfig) => void;
}

const visualizationTypes = [
  {
    id: 'flowchart',
    name: 'Flow Diagrams',
    description: 'Control flow and logic diagrams from your code',
    icon: BarChart3,
    color: 'text-blue-500'
  },
  {
    id: 'api-graph',
    name: 'API Call Graphs',
    description: 'Network requests and API interaction patterns',
    icon: Network,
    color: 'text-green-500'
  },
  {
    id: 'changelog',
    name: 'Change Logs',
    description: 'Code evolution and commit history visualization',
    icon: GitBranch,
    color: 'text-purple-500'
  },
  {
    id: 'architecture',
    name: 'Architecture Diagrams',
    description: 'System structure and component relationships',
    icon: Code,
    color: 'text-orange-500'
  }
];

export const AnalysisOptions = ({ files, config, onConfigChange, onAnalyze }: AnalysisOptionsProps) => {
  const [detectedFunctions, setDetectedFunctions] = useState<string[]>([]);

  // Mock function detection from files
  const mockDetectFunctions = (files: UploadedFile[]): string[] => {
    const functions = [];
    
    // Simple regex-based function detection for demo
    files.forEach(file => {
      const content = file.content;
      
      // JavaScript/TypeScript functions
      const jsFunctions = content.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=|(\w+)\s*\(.*?\)\s*=>)/g);
      if (jsFunctions) {
        jsFunctions.forEach(match => {
          const funcName = match.match(/\w+/)?.[0];
          if (funcName && !functions.includes(funcName)) {
            functions.push(`${file.name}::${funcName}`);
          }
        });
      }
      
      // Python functions
      const pyFunctions = content.match(/def\s+(\w+)/g);
      if (pyFunctions) {
        pyFunctions.forEach(match => {
          const funcName = match.replace('def ', '');
          if (!functions.includes(funcName)) {
            functions.push(`${file.name}::${funcName}`);
          }
        });
      }
    });
    
    return functions.slice(0, 20); // Limit for demo
  };

  useEffect(() => {
    const functions = mockDetectFunctions(files);
    setDetectedFunctions(functions);
  }, [files]);

  const handleScopeChange = (scope: 'entire' | 'file' | 'function') => {
    onConfigChange({ ...config, scope });
  };

  const handleFileSelection = (filePath: string, checked: boolean) => {
    const selectedFiles = checked
      ? [...config.selectedFiles, filePath]
      : config.selectedFiles.filter(f => f !== filePath);
    
    onConfigChange({ ...config, selectedFiles });
  };

  const handleFunctionSelection = (functionName: string, checked: boolean) => {
    const selectedFunctions = checked
      ? [...config.selectedFunctions, functionName]
      : config.selectedFunctions.filter(f => f !== functionName);
      
    onConfigChange({ ...config, selectedFunctions });
  };

  const handleVisualizationTypeChange = (type: string, checked: boolean) => {
    const visualizationTypes = checked
      ? [...config.visualizationTypes, type as any]
      : config.visualizationTypes.filter(t => t !== type);
    
    onConfigChange({ ...config, visualizationTypes });
  };

  const isAnalyzeEnabled = () => {
    if (config.scope === 'file' && config.selectedFiles.length === 0) return false;
    if (config.scope === 'function' && config.selectedFunctions.length === 0) return false;
    if (config.visualizationTypes.length === 0) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Analysis Scope */}
      <Card className="feature-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Circle className="h-5 w-5 text-primary" />
            Analysis Scope
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={config.scope} onValueChange={handleScopeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="entire" id="entire" />
              <Label htmlFor="entire" className="font-medium">
                Entire Codebase
              </Label>
              <Badge variant="secondary" className="ml-2">
                {files.length} files
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Analyze all uploaded files for comprehensive visualization
            </p>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="file" id="file" />
              <Label htmlFor="file" className="font-medium">
                Specific Files
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Choose individual files to focus your analysis
            </p>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="function" id="function" />
              <Label htmlFor="function" className="font-medium">
                Specific Functions
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Target specific functions for detailed flow analysis
            </p>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* File Selection */}
      {config.scope === 'file' && (
        <Card className="feature-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Select Files ({config.selectedFiles.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {files.map((file) => (
                <div key={file.path} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                  <Checkbox
                    id={file.path}
                    checked={config.selectedFiles.includes(file.path)}
                    onCheckedChange={(checked) => handleFileSelection(file.path, checked as boolean)}
                  />
                  <Label htmlFor={file.path} className="flex-1 text-sm font-medium cursor-pointer">
                    {file.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">{file.type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Function Selection */}
      {config.scope === 'function' && (
        <Card className="feature-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Select Functions ({config.selectedFunctions.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {detectedFunctions.map((func) => (
                <div key={func} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted">
                  <Checkbox
                    id={func}
                    checked={config.selectedFunctions.includes(func)}
                    onCheckedChange={(checked) => handleFunctionSelection(func, checked as boolean)}
                  />
                  <Label htmlFor={func} className="flex-1 text-sm font-medium cursor-pointer font-mono">
                    {func.split('::')[1]}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {func.split('::')[0]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualization Type */}
      <Card className="feature-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Visualization Types ({config.visualizationTypes.length} selected)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visualizationTypes.map((type) => (
              <div
                key={type.id}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${config.visualizationTypes.includes(type.id as any)
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={type.id}
                    checked={config.visualizationTypes.includes(type.id as any)}
                    onCheckedChange={(checked) => handleVisualizationTypeChange(type.id, checked as boolean)}
                  />
                  <type.icon className={`h-6 w-6 mt-1 ${type.color}`} />
                  <div className="flex-1" onClick={() => handleVisualizationTypeChange(type.id, !config.visualizationTypes.includes(type.id as any))}>
                    <h4 className="font-medium text-foreground mb-1">{type.name}</h4>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => onAnalyze(config)}
          disabled={!isAnalyzeEnabled()}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 transition-opacity px-8"
        >
          <Play className="h-5 w-5 mr-2" />
          Generate Visualizations
        </Button>
      </div>
    </div>
  );
};