import { useState } from "react";
import { Bot, Send, Sparkles, FileText, Code, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
  type?: 'suggestion' | 'question' | 'response';
}

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoMessages: Message[] = [
  {
    id: "1",
    content: "I've analyzed your API Documentation. I can help you improve the structure, add missing endpoints, or generate code examples. What would you like me to help with?",
    isAI: true,
    timestamp: "2 min ago",
    type: 'suggestion'
  },
  {
    id: "2", 
    content: "Can you add authentication examples for the login endpoint?",
    isAI: false,
    timestamp: "1 min ago",
    type: 'question'
  },
  {
    id: "3",
    content: "I'll add comprehensive authentication examples with request/response samples and error handling. Here's what I suggest for your login endpoint documentation...",
    isAI: true,
    timestamp: "30 sec ago", 
    type: 'response'
  }
];

const quickActions = [
  { id: "enhance", label: "Enhance Documentation", icon: Sparkles },
  { id: "examples", label: "Add Code Examples", icon: Code },
  { id: "structure", label: "Improve Structure", icon: FileText },
  { id: "review", label: "Review & Suggestions", icon: HelpCircle }
];

const demoResponses: Record<string, string> = {
  "enhance": "I can help enhance your API documentation by:\n\n• Adding detailed descriptions for each endpoint\n• Including request/response examples\n• Adding error code explanations\n• Improving parameter documentation\n\nWhich section would you like me to start with?",
  "examples": "I'll add code examples in multiple languages (JavaScript, Python, cURL) for each endpoint. This includes:\n\n• Authentication examples\n• Request formatting\n• Response handling\n• Error management\n\nShall I begin with the authentication endpoints?",
  "structure": "Your documentation structure looks good! I suggest these improvements:\n\n• Group related endpoints together\n• Add a quick reference section\n• Include rate limiting information\n• Add troubleshooting guide\n\nWould you like me to reorganize any specific sections?",
  "review": "After reviewing your API documentation, here are my suggestions:\n\n✅ Good: Clear endpoint descriptions\n✅ Good: Proper HTTP methods\n\n💡 Improvements:\n• Add more detailed error responses\n• Include authentication flow diagram\n• Add SDK information\n\nShall I implement these improvements?"
};

export const AIAssistantPanel = ({ isOpen, onClose }: AIAssistantPanelProps) => {
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isAI: false,
      timestamp: "now",
      type: 'question'
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand you'd like help with that. In this demo mode, I'm providing sample responses to showcase the AI assistant functionality. The real AI would analyze your specific documentation content and provide contextual suggestions.",
        isAI: true,
        timestamp: "now",
        type: 'response'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputValue("");
  };

  const handleQuickAction = (actionId: string) => {
    const response = demoResponses[actionId];
    if (response) {
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        isAI: true,
        timestamp: "now",
        type: 'suggestion'
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="w-80 h-full border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
            DEMO
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.id)}
              className="text-xs hover:bg-muted"
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isAI ? 'justify-start' : 'justify-end'}`}
            >
              {message.isAI && (
                <Avatar className="h-6 w-6 bg-primary">
                  <Bot className="h-3 w-3 text-primary-foreground" />
                </Avatar>
              )}
              <div
                className={`max-w-[200px] rounded-lg p-3 text-sm ${
                  message.isAI
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp}
                </span>
              </div>
              {!message.isAI && (
                <Avatar className="h-6 w-6 bg-secondary">
                  <span className="text-xs font-medium text-secondary-foreground">You</span>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your documentation..."
            className="text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Demo mode - Responses are simulated for testing
        </p>
      </div>
    </Card>
  );
};