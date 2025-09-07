import { useState } from "react";
import { Eye, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sampleSummaries = [
  {
    original: "React documentation about hooks",
    summary: "• Hooks let you use state and other React features without writing a class\n• useState returns a pair: current state value and a function to update it\n• useEffect lets you perform side effects in function components\n• Only call Hooks at the top level of your React function"
  },
  {
    original: "API security best practices",
    summary: "• Always use HTTPS for API communication\n• Implement proper authentication (JWT, OAuth)\n• Validate and sanitize all input data\n• Use rate limiting to prevent abuse\n• Keep API keys and secrets secure"
  }
];

export const Summariser = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleSummarize = () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setSummary("");
    
    // Simulate AI processing
    setTimeout(() => {
      // Simple keyword-based summary generation
      const keywords = inputText.toLowerCase().match(/\b\w{4,}\b/g) || [];
      const uniqueKeywords = [...new Set(keywords)].slice(0, 4);
      
      const mockSummary = `**TL;DR Summary:**

• Key topics: ${uniqueKeywords.join(', ')}
• Main focus: ${inputText.split('.')[0]}...
• Length: ${inputText.length} characters reduced to this summary
• Contains ${inputText.split(' ').length} words of content

**Key Points:**
• Primary concept discussed in the text
• Important details and specifications
• Actionable items or conclusions
• Relevant context and implications`;

      setSummary(mockSummary);
      setIsLoading(false);
    }, 2000);
  };

  const validateMarkdown = (text: string) => {
    // Simple markdown validation
    const hasMarkdown = /[*_`#\[\]()]/.test(text);
    const hasHeaders = /^#{1,6}\s/.test(text);
    const hasList = /^[-*+]\s/.test(text);
    
    setIsValid(hasMarkdown || hasHeaders || hasList);
  };

  const useSample = (sample: typeof sampleSummaries[0]) => {
    setInputText(`Sample: ${sample.original}\n\n${sample.summary}`);
    setSummary(sample.summary);
    setIsValid(true);
  };

  return (
    <Card className="mt-2 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          Text Summariser & Markdown Validator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sample Options */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Quick Samples:</label>
          <div className="flex gap-2 flex-wrap">
            {sampleSummaries.map((sample, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => useSample(sample)}
                className="h-6 px-2 text-xs"
              >
                {sample.original}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Text */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Paste your text:</label>
          <Textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              validateMarkdown(e.target.value);
            }}
            placeholder="Paste long documentation, articles, or markdown content here..."
            className="min-h-[100px] text-xs"
          />
          
          {/* Markdown Validation */}
          {inputText && (
            <div className="flex items-center gap-2">
              {isValid ? (
                <Badge variant="secondary" className="text-xs bg-success/20 text-success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid Markdown
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Plain Text
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Summarize Button */}
        <Button
          onClick={handleSummarize}
          disabled={!inputText.trim() || isLoading}
          className="w-full bg-gradient-primary hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Summarizing...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>

        {/* Summary Output */}
        {summary && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Summary:</label>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs whitespace-pre-wrap">
                {summary}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              ✨ Original: {inputText.split(' ').length} words → Summary: {summary.split(' ').length} words
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};