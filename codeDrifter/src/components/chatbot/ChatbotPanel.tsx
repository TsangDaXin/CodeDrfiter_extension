import { useState } from "react";
import { MessageSquare, X, Bot, User, FileText, Eye, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import { QuickActions } from "./QuickActions";
import { DocGenerator } from "./DocGenerator";
import { Summariser } from "./Summariser";
import { Visualizer } from "./Visualizer";
import { FileUploader } from "./FileUploader";
import { SaveConversation } from "./SaveConversation";
import { FlowchartRenderer } from "./FlowchartRenderer";
import { EnhancedSummariser } from "./EnhancedSummariser";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  component?: 'doc-generator' | 'summariser' | 'visualizer' | 'flowchart' | 'enhanced-summariser';
  metadata?: {
    fileName?: string;
    fileType?: string;
    fileUrl?: string;
    diagram?: string;
    originalText?: string;
  };
}

interface ChatbotPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatbotPanel = ({ isOpen, onToggle }: ChatbotPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 Hi! I\'m your CodeDrifer GPT assistant. I can help you with development questions, file analysis, documentation, and more. What would you like to do today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Enhanced keyword-based responses
    setTimeout(() => {
      let response = '';
      let component: Message['component'] | undefined;
      let metadata: Message['metadata'] | undefined;
      
      const input = inputValue.toLowerCase();
      
      // API-related questions
      if (input.includes('api') || input.includes('endpoint') || input.includes('rest')) {
        response = 'Here\'s how to work with APIs:\n\n**REST API Basics:**\n• GET /api/users - Fetch users\n• POST /api/users - Create user\n• PUT /api/users/:id - Update user\n• DELETE /api/users/:id - Delete user\n\n**Request Body Example:**\n```json\n{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "password": "securePassword123"\n}\n```\n\nWould you like me to generate API documentation templates?';
      }
      // User creation questions
      else if (input.includes('how') && input.includes('user')) {
        response = 'Here\'s how to create a user system:\n\n**1. Database Schema:**\n```sql\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100) UNIQUE,\n  password_hash VARCHAR(255),\n  created_at TIMESTAMP\n);\n```\n\n**2. API Endpoint:**\n```javascript\nPOST /api/users\n{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "password": "password123"\n}\n```\n\n**3. Validation Rules:**\n• Email must be unique\n• Password min 8 characters\n• Name is required';
      }
      // Flowchart requests
      else if (input.includes('flowchart') || input.includes('diagram') || input.includes('flow')) {
        response = 'Here\'s a flowchart showing the user authentication process:';
        component = 'flowchart';
        metadata = {
          diagram: `graph TD
    A[User Login] --> B{Valid Credentials?}
    B -->|Yes| C[Generate JWT Token]
    B -->|No| D[Return Error]
    C --> E[Store Token]
    E --> F[Redirect to Dashboard]
    D --> G[Show Login Form]
    F --> H[User Dashboard]
    G --> A`
        };
      }
      // Documentation generation
      else if (input.includes('generate') || input.includes('create') || input.includes('starter') || input.includes('documentation')) {
        response = 'I can help you generate starter documentation! Let me show you some templates.';
        component = 'doc-generator';
      }
      // Summarization requests
      else if (input.includes('summarize') || input.includes('summary') || input.includes('tldr')) {
        response = 'I\'ll help you create a summary. Paste your long text and I\'ll generate a TL;DR version.';
        component = 'enhanced-summariser';
      }
      // Database questions
      else if (input.includes('database') || input.includes('sql') || input.includes('query')) {
        response = 'Here are common database operations:\n\n**Create Table:**\n```sql\nCREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255),\n  price DECIMAL(10,2),\n  category_id INT REFERENCES categories(id)\n);\n```\n\n**Common Queries:**\n```sql\n-- Select with join\nSELECT p.name, c.name as category \nFROM products p \nJOIN categories c ON p.category_id = c.id;\n\n-- Insert data\nINSERT INTO products (name, price, category_id) \nVALUES (\'Laptop\', 999.99, 1);\n```';
      }
      // Authentication questions
      else if (input.includes('auth') || input.includes('login') || input.includes('jwt') || input.includes('token')) {
        response = 'Here\'s how to implement authentication:\n\n**JWT Token Flow:**\n1. User sends credentials to /api/login\n2. Server validates and creates JWT\n3. Client stores token in localStorage\n4. Include token in Authorization header\n\n**Example Implementation:**\n```javascript\n// Login endpoint\napp.post(\'/api/login\', async (req, res) => {\n  const { email, password } = req.body;\n  const user = await validateUser(email, password);\n  \n  if (user) {\n    const token = jwt.sign({ userId: user.id }, SECRET_KEY);\n    res.json({ token, user });\n  } else {\n    res.status(401).json({ error: \'Invalid credentials\' });\n  }\n});\n```';
      }
      // General help
      else {
        response = 'I can help you with:\n\n🚀 **Development Questions**\n• API design and endpoints\n• Database schema and queries\n• User authentication systems\n• Code examples and best practices\n\n📄 **Documentation**\n• Generate starter docs (README, API docs)\n• Create user guides and tutorials\n\n📊 **Visual Tools**\n• Generate flowcharts and diagrams\n• Create process flows\n\n📝 **Text Processing**\n• Summarize long content\n• Extract key information\n\n📎 **File Analysis**\n• Upload and analyze documents\n• Process images and PDFs\n\nWhat would you like help with?';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        component,
        metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    setInputValue('');
  };

  const handleQuickAction = (action: string) => {
    let content = '';
    let component: Message['component'] | undefined;
    let metadata: Message['metadata'] | undefined;

    switch (action) {
      case 'generate-starter':
        content = 'Generate Starter Doc';
        component = 'doc-generator';
        break;
      case 'summarize':
        content = 'Summarize This';
        component = 'enhanced-summariser';
        break;
      case 'show-diagram':
        content = 'Show Diagram';
        component = 'flowchart';
        metadata = {
          diagram: `graph TD
    A[Start] --> B{Decision Point}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`
        };
        break;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: `Let me help you with that!`,
      timestamp: new Date(),
      component,
      metadata
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleFileUpload = (file: File, fileUrl: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Uploaded file: ${file.name}`,
      timestamp: new Date(),
      metadata: {
        fileName: file.name,
        fileType: file.type,
        fileUrl
      }
    };

    let response = '';
    if (file.type.startsWith('image/')) {
      response = `📸 Image "${file.name}" uploaded successfully! I can see it's a ${file.type} file. Here's what I can help you with:\n\n• Analyze image content\n• Generate alt text descriptions\n• Extract text if it contains documentation\n• Create image-based documentation\n\nWhat would you like me to do with this image?`;
    } else if (file.type.includes('pdf')) {
      response = `📄 PDF "${file.name}" uploaded successfully! I can help you:\n\n• Extract key information\n• Summarize the document\n• Create documentation based on the content\n• Generate TL;DR summaries\n\nThe document has been received and is ready for analysis.`;
    } else if (file.type.includes('text') || file.name.endsWith('.md')) {
      response = `📝 Document "${file.name}" uploaded successfully! I can help you:\n\n• Summarize the content\n• Reformat for documentation\n• Extract important sections\n• Create structured summaries\n\nWhat would you like me to do with this document?`;
    } else {
      response = `📎 File "${file.name}" uploaded successfully! File received and ready for processing. Let me know how I can help analyze or work with this file.`;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full bg-gradient-primary hover:opacity-90 shadow-elegant"
          size="sm"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      {/* Chat Panel */}
      <div className={cn(
        "fixed right-0 top-0 h-full bg-card border-l border-border transition-all duration-300 z-40 flex flex-col",
        isOpen ? "w-96" : "w-0"
      )}>
        {isOpen && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-card">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">AI Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <QuickActions onAction={handleQuickAction} />

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <MessageBubble message={message} />
                    {message.component === 'doc-generator' && (
                      <DocGenerator />
                    )}
                    {message.component === 'summariser' && (
                      <Summariser />
                    )}
                    {message.component === 'enhanced-summariser' && (
                      <EnhancedSummariser originalText={message.metadata?.originalText} />
                    )}
                    {message.component === 'visualizer' && (
                      <Visualizer />
                    )}
                    {message.component === 'flowchart' && message.metadata?.diagram && (
                      <FlowchartRenderer diagram={message.metadata.diagram} />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2 mb-2">
                <div className="flex gap-1">
                  <FileUploader onFileUpload={handleFileUpload} />
                  <SaveConversation messages={messages} />
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything... (try 'flowchart', 'summarize', or 'how to create user')"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};