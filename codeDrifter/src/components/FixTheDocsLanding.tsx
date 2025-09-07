import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, FileText, Eye, BarChart3, Upload, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCard {
  icon: typeof FileText;
  title: string;
  description: string;
  tag: string;
}

const featureCards: FeatureCard[] = [
  {
    icon: FileText,
    title: "Starter Docs Generator",
    description: "Auto-generate README or API docs",
    tag: "Writing"
  },
  {
    icon: Eye,
    title: "Smart Summarizer",
    description: "Get instant TL;DR for long docs",
    tag: "Reading"
  },
  {
    icon: BarChart3,
    title: "Flowchart Visualizer", 
    description: "Generate static flow diagrams from keywords",
    tag: "Visuals"
  },
  {
    icon: Upload,
    title: "File Upload & Save",
    description: "Upload docs or export chatbot replies",
    tag: "Tools"
  }
];

const quickActions = [
  "Generate Starter Docs",
  "Summarize a Document", 
  "Create a Flowchart",
  "Upload File"
];

export const FixTheDocsLanding = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    const actionMap: Record<string, string> = {
      "Generate Starter Docs": "generate starter docs",
      "Summarize a Document": "summarize",
      "Create a Flowchart": "flowchart",
      "Upload File": "upload file"
    };
    setInputValue(actionMap[action] || action.toLowerCase());
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    // Navigate to ChatbotQA page with the prompt
    navigate('/chatqa', { state: { initialPrompt: inputValue } });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-card border-b border-border">
        <div className="absolute inset-0 bg-gradient-glow opacity-10" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          {/* Glowing Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-glow-pulse" />
              <div className="relative bg-gradient-primary p-4 rounded-full">
                <Bot className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text">
            Hi, Developer!
          </h1>
          
          <h2 className="text-2xl text-muted-foreground mb-6">
            How can we help you today?
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Let's get started! In a few simple steps, we'll show you how{" "}
            <span className="text-primary font-semibold">Fix the Docs</span>{" "}
            can simplify writing, speed up reading, and unlock your productivity.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Quick Action Buttons */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
            Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {quickActions.map((action) => (
              <Button
                key={action}
                variant="outline"
                size="lg"
                onClick={() => handleQuickAction(action)}
                className="glow-border rounded-full px-6 py-3 bg-card/50 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              >
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input Bar */}
        <div className="mb-16">
          <Card className="max-w-3xl mx-auto p-4 bg-card/50 border-primary/10 input-glow">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Fix the Docs... (try 'summarize', 'flowchart', or 'how to create user')"
                  className="bg-background/80 border-border/50 text-lg py-6 pr-14 focus:border-primary/40 transition-colors"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-primary hover:bg-primary/90 rounded-lg"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Cards Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Powerful Features at Your Fingertips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureCards.map((card, index) => (
              <Card
                key={index}
                className="feature-card p-6 border-primary/10 hover:border-primary/30 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <card.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {card.title}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className="bg-primary/10 text-primary border-primary/20 text-xs"
                      >
                        {card.tag}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Bot className="h-4 w-4" />
            Ready to boost your documentation workflow?
          </div>
        </div>
      </div>
    </div>
  );
};