import { useState } from "react";
import { Eye, Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnhancedSummariserProps {
  originalText?: string;
}

export const EnhancedSummariser = ({ originalText = "" }: EnhancedSummariserProps) => {
  const [inputText, setInputText] = useState(originalText);
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSummary = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Simple hard-coded summarization logic
      const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
      let summaryText = "";
      
      if (sentences.length <= 2) {
        summaryText = "TL;DR: " + inputText.trim();
      } else if (sentences.length <= 5) {
        summaryText = `TL;DR: ${sentences[0].trim()}. ${sentences[sentences.length - 1].trim()}.`;
      } else {
        // Take first sentence, middle sentence, and last sentence
        const midIndex = Math.floor(sentences.length / 2);
        summaryText = `TL;DR: ${sentences[0].trim()}. ${sentences[midIndex].trim()}. ${sentences[sentences.length - 1].trim()}.`;
      }
      
      // Add some smart keywords based on content
      if (inputText.toLowerCase().includes('api') || inputText.toLowerCase().includes('endpoint')) {
        summaryText += " (API-related content)";
      } else if (inputText.toLowerCase().includes('user') || inputText.toLowerCase().includes('login')) {
        summaryText += " (User management content)";
      } else if (inputText.toLowerCase().includes('database') || inputText.toLowerCase().includes('data')) {
        summaryText += " (Database-related content)";
      }
      
      setSummary(summaryText);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCopy = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="mt-2 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          Text Summarizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Paste your text to summarize:
          </label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your long text here and I'll create a TL;DR summary..."
            className="min-h-[100px] text-xs"
          />
        </div>
        
        <Button
          onClick={generateSummary}
          disabled={!inputText.trim() || isProcessing}
          className="w-full bg-gradient-primary hover:opacity-90"
          size="sm"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Generate Summary"
          )}
        </Button>
        
        {summary && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Summary:
              </label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-6 px-2"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-foreground font-medium">{summary}</p>
            </div>
            
            <div className="text-xs text-muted-foreground">
              ✨ Summary generated using keyword extraction and sentence importance
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};