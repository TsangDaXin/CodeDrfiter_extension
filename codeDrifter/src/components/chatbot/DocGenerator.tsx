import { useState } from "react";
import { FileText, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const templates = {
  readme: {
    title: "README.md",
    content: `# Project Name

Brief description of your project.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT`
  },
  api: {
    title: "API Documentation",
    content: `# API Reference

## Authentication

All API requests require authentication using Bearer tokens.

\`\`\`
Authorization: Bearer <your-token>
\`\`\`

## Endpoints

### GET /api/users

Returns a list of users.

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

### POST /api/users

Creates a new user.

**Request Body:**
\`\`\`json
{
  "name": "string",
  "email": "string"
}
\`\`\`

## Error Codes

- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error`
  },
  guide: {
    title: "User Guide",
    content: `# Getting Started Guide

Welcome to our platform! This guide will help you get up and running quickly.

## Step 1: Setup

1. Create an account
2. Verify your email
3. Complete your profile

## Step 2: Basic Usage

### Creating Your First Project

1. Click the "New Project" button
2. Fill in the project details
3. Choose your template
4. Click "Create"

### Managing Projects

- **Edit**: Click the pencil icon
- **Delete**: Click the trash icon  
- **Share**: Click the share button

## Step 3: Advanced Features

### Collaboration

Invite team members by:
1. Going to Project Settings
2. Click "Invite Members"
3. Enter their email addresses

### Integrations

Connect with popular tools:
- GitHub
- Slack
- Jira

## Need Help?

Contact support at support@example.com`
  }
};

export const DocGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("readme");
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = async (content: string, templateKey: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedStates(prev => ({ ...prev, [templateKey]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [templateKey]: false }));
    }, 2000);
  };

  return (
    <Card className="mt-2 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Documentation Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="readme" className="text-xs">README</TabsTrigger>
            <TabsTrigger value="api" className="text-xs">API Docs</TabsTrigger>
            <TabsTrigger value="guide" className="text-xs">Guide</TabsTrigger>
          </TabsList>
          
          {Object.entries(templates).map(([key, template]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{template.title}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(template.content, key)}
                    className="h-7 px-2"
                  >
                    {copiedStates[key] ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                
                <Textarea
                  value={template.content}
                  readOnly
                  className="min-h-[200px] text-xs font-mono bg-muted"
                />
                
                <div className="text-xs text-muted-foreground">
                  ✨ This template includes common sections and best practices
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};