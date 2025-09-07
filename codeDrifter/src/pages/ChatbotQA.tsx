import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bot, Send, Upload, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/components/chatbot/qa/ChatMessage";
import { FileUploadButton } from "@/components/chatbot/qa/FileUploadButton";
import { SaveConversationButton } from "@/components/chatbot/qa/SaveConversationButton";
import { FlowchartDisplay } from "@/components/chatbot/qa/FlowchartDisplay";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasFlowchart?: boolean;
  flowchartData?: string;
}

export const ChatbotQA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m CodeDrifer GPT. I can help you with development questions, create flowcharts, summarize content, and more. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle initial prompt from navigation state
  useEffect(() => {
    const initialPrompt = location.state?.initialPrompt;
    if (initialPrompt) {
      setInputValue(initialPrompt);
      // Clear the state to prevent re-triggering
      navigate('/chatqa', { replace: true });
    }
  }, [location.state, navigate]);

  const generateResponse = (input: string): { content: string; hasFlowchart?: boolean; flowchartData?: string } => {
    const lowerInput = input.toLowerCase();

    // Generate Starter Docs detection
    if (lowerInput.includes('generate starter docs') || lowerInput.includes('starter docs')) {
      return {
        content: `**📄 Starter Documentation Template Generated!**

# Project Name

## Overview
Brief description of your project and its main purpose.

## Installation
\`\`\`bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## API Documentation
### Authentication
- **POST** \`/api/auth/login\` - User login
- **POST** \`/api/auth/register\` - User registration

### Users
- **GET** \`/api/users\` - Get all users
- **POST** \`/api/users\` - Create new user
- **PUT** \`/api/users/:id\` - Update user
- **DELETE** \`/api/users/:id\` - Delete user

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License`
      };
    }
    
    // Flowchart detection
    if (lowerInput.includes('flowchart') || lowerInput.includes('diagram') || lowerInput.includes('flow')) {
      return {
        content: 'Here\'s a flowchart showing the user authentication process:',
        hasFlowchart: true,
        flowchartData: `graph TD
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

    // Summarization detection
    if (lowerInput.includes('summarize') || lowerInput.includes('summary') || lowerInput.includes('tldr')) {
      // Check if there's actual content to summarize
      if (input.length > 200) {
        return {
          content: `**📝 TL;DR Summary Generated:**

**Key Points:**
• This document discusses the main concepts and implementation details
• Covers essential steps and requirements for the process
• Provides important guidelines and best practices
• Includes critical outcomes and expected results

**Main Topics:**
• Technical implementation details
• User workflow and interaction patterns  
• Data processing and management
• Security and performance considerations

**Action Items:**
• Review the implementation steps
• Follow the recommended guidelines
• Test all critical components
• Monitor performance metrics

*Note: This is a sample summary. Paste your actual long text and I'll create a specific TL;DR for your content.*`
        };
      } else {
        return {
          content: '**📝 Summarization Tool Ready!**\n\nTo get a specific summary:\n1. Paste your long text or document content\n2. Add "summarize" or "tldr" to your message\n3. I\'ll create a concise summary with key points\n\n**Example:** \n*"Here\'s my long article about React hooks... please summarize"*'
        };
      }
    }

    // User creation questions
    if (lowerInput.includes('how') && lowerInput.includes('user')) {
      return {
        content: 'Use POST /users with JSON body {name, email, password}.\n\n**Example Request:**\n```json\n{\n  "name": "John Doe",\n  "email": "john@example.com",\n  "password": "securePassword123"\n}\n```\n\n**Response:**\n```json\n{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com",\n  "created_at": "2024-01-15T10:30:00Z"\n}\n```'
      };
    }

    // API questions
    if (lowerInput.includes('api') || lowerInput.includes('endpoint') || lowerInput.includes('rest')) {
      return {
        content: '**REST API Endpoints:**\n\n• `GET /api/users` - Fetch all users\n• `POST /api/users` - Create new user\n• `PUT /api/users/:id` - Update user\n• `DELETE /api/users/:id` - Delete user\n\n**Authentication:**\nInclude Bearer token in headers:\n```\nAuthorization: Bearer your-jwt-token\n```'
      };
    }

    // Database questions
    if (lowerInput.includes('database') || lowerInput.includes('sql') || lowerInput.includes('query')) {
      return {
        content: '**Common Database Operations:**\n\n```sql\n-- Create table\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  email VARCHAR(255) UNIQUE,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Insert data\nINSERT INTO users (name, email) \nVALUES (\'John Doe\', \'john@example.com\');\n\n-- Query with JOIN\nSELECT u.name, p.title \nFROM users u \nJOIN posts p ON u.id = p.user_id;\n```'
      };
    }

    // Authentication questions
    if (lowerInput.includes('auth') || lowerInput.includes('login') || lowerInput.includes('jwt') || lowerInput.includes('token')) {
      return {
        content: '**JWT Authentication Flow:**\n\n1. User sends credentials to `/api/login`\n2. Server validates and creates JWT\n3. Client stores token in localStorage\n4. Include token in Authorization header\n\n**Example:**\n```javascript\nconst response = await fetch(\'/api/login\', {\n  method: \'POST\',\n  headers: { \'Content-Type\': \'application/json\' },\n  body: JSON.stringify({ email, password })\n});\n\nconst { token } = await response.json();\nlocalStorage.setItem(\'token\', token);\n```'
      };
    }

    // Default response
    return {
      content: 'I can help you with:\n\n🚀 **Development Questions**\n• API design and implementation\n• Database queries and schema\n• User authentication systems\n• Code examples and best practices\n\n📊 **Visual Tools**\n• Type "flowchart" to generate diagrams\n• Process flows and system architecture\n\n📝 **Text Processing**\n• Type "summarize" for content summaries\n• Extract key information from text\n\n📁 **File Analysis**\n• Upload documents for analysis\n• Process images, PDFs, and text files\n\nWhat would you like help with today?'
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      const response = generateResponse(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        hasFlowchart: response.hasFlowchart,
        flowchartData: response.flowchartData
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = (file: File) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Uploaded file: ${file.name}`,
      timestamp: new Date()
    };

    let response = '';
    if (file.type.startsWith('image/')) {
      response = `📸 Image "${file.name}" uploaded successfully! I can analyze image content, generate descriptions, or extract text if it contains documentation.`;
    } else if (file.type.includes('pdf')) {
      response = `📄 PDF "${file.name}" uploaded successfully! I can help extract key information, summarize the document, or create structured documentation.`;
    } else if (file.type.includes('text') || file.name.endsWith('.md')) {
      response = `📝 Document "${file.name}" uploaded successfully! I can summarize content, reformat for documentation, or extract important sections.`;
    } else {
      response = `📎 File "${file.name}" uploaded successfully! File received and ready for processing.`;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border p-8 text-center relative">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-4xl font-bold text-foreground mb-2">Hi, Developer!</h1>
        <h2 className="text-xl text-muted-foreground mb-4">How can we help you today?</h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Let's get started! In a few simple steps, we'll show you how to use CodeDrifer GPT to unlock your productivity.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Messages */}
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                <ChatMessage message={message} />
                {message.hasFlowchart && message.flowchartData && (
                  <div className="mt-2">
                    <FlowchartDisplay diagram={message.flowchartData} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-muted rounded-lg px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2">
            <FileUploadButton onFileUpload={handleFileUpload} />
            <SaveConversationButton messages={messages} />
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything... (try 'flowchart', 'summarize', or 'how to create user')"
                className="pr-12 bg-background"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};