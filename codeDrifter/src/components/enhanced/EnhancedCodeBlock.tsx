import { useState } from "react";
import { Copy, Download, Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface EnhancedCodeBlockProps {
  onInsert: (content: string) => void;
  onClose: () => void;
}

const programmingLanguages = [
  { value: 'javascript', label: 'JavaScript', ext: '.js' },
  { value: 'typescript', label: 'TypeScript', ext: '.ts' },
  { value: 'python', label: 'Python', ext: '.py' },
  { value: 'java', label: 'Java', ext: '.java' },
  { value: 'cpp', label: 'C++', ext: '.cpp' },
  { value: 'c', label: 'C', ext: '.c' },
  { value: 'ruby', label: 'Ruby', ext: '.rb' },
  { value: 'go', label: 'Go', ext: '.go' },
  { value: 'rust', label: 'Rust', ext: '.rs' },
  { value: 'swift', label: 'Swift', ext: '.swift' },
  { value: 'php', label: 'PHP', ext: '.php' },
  { value: 'html', label: 'HTML', ext: '.html' },
  { value: 'css', label: 'CSS', ext: '.css' },
  { value: 'sql', label: 'SQL', ext: '.sql' },
  { value: 'bash', label: 'Bash', ext: '.sh' },
  { value: 'json', label: 'JSON', ext: '.json' },
  { value: 'yaml', label: 'YAML', ext: '.yml' },
  { value: 'markdown', label: 'Markdown', ext: '.md' }
];

const codeTemplates: Record<string, string> = {
  javascript: `// Example JavaScript function
function calculateSum(a, b) {
  return a + b;
}

console.log(calculateSum(5, 3));`,
  
  python: `# Example Python function
def calculate_sum(a, b):
    return a + b

result = calculate_sum(5, 3)
print(f"Result: {result}")`,
  
  java: `// Example Java class
public class Calculator {
    public static int calculateSum(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        System.out.println(calculateSum(5, 3));
    }
}`,
  
  typescript: `// Example TypeScript interface and function
interface Numbers {
  a: number;
  b: number;
}

function calculateSum({ a, b }: Numbers): number {
  return a + b;
}

console.log(calculateSum({ a: 5, b: 3 }));`
};

export const EnhancedCodeBlock = ({ onInsert, onClose }: EnhancedCodeBlockProps) => {
  const [filename, setFilename] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(codeTemplates.javascript);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [allowCopy, setAllowCopy] = useState(true);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const template = codeTemplates[value] || `// ${value} code here\n`;
    setCode(template);
    
    // Auto-suggest filename based on language
    if (!filename) {
      const lang = programmingLanguages.find(l => l.value === value);
      setFilename(`example${lang?.ext || '.txt'}`);
    }
  };

  const handleInsert = () => {
    const codeBlockHtml = `
      <div class="enhanced-code-block" data-language="${language}" data-filename="${filename}">
        <div class="code-header">
          <div class="filename">${filename}</div>
          <div class="language-badge">${programmingLanguages.find(l => l.value === language)?.label || language}</div>
        </div>
        <pre class="code-content ${showLineNumbers ? 'with-line-numbers' : ''}"><code class="language-${language}">${code}</code></pre>
        ${allowCopy ? '<div class="code-actions"><button class="copy-btn">Copy</button></div>' : ''}
      </div>
    `;
    
    onInsert(codeBlockHtml);
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Card className="w-96 p-4 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Enhanced Code Block</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
            DEMO
          </Badge>
        </div>

        {/* Filename Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">File Name</label>
          <Input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename (e.g., main.py)"
            className="text-sm"
          />
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Programming Language</label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {programmingLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <div className="flex items-center gap-2">
                    <span>{lang.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {lang.ext}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Code Editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-32 p-3 text-sm font-mono bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Enter your code here..."
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Show line numbers</label>
            <Switch checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Allow copying</label>
            <Switch checked={allowCopy} onCheckedChange={setAllowCopy} />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Preview</label>
          <div className="border border-border rounded-lg overflow-hidden bg-muted/20">
            <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{filename || 'untitled'}</span>
                <Badge variant="secondary" className="text-xs">
                  {programmingLanguages.find(l => l.value === language)?.label || language}
                </Badge>
              </div>
              {allowCopy && (
                <Button variant="ghost" size="sm" onClick={copyCode} className="h-6 px-2">
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
            <pre className={`p-3 text-sm font-mono bg-input text-foreground overflow-x-auto ${showLineNumbers ? 'pl-8' : ''}`}>
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleInsert} className="flex-1">
            Insert Code Block
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Demo code block with syntax highlighting preview
        </p>
      </div>
    </Card>
  );
};