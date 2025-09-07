import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  content: string;
  type: 'file' | 'folder';
  path: string;
}

interface GitHubIntegrationProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export const GitHubIntegration = ({ onFilesUploaded }: GitHubIntegrationProps) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Repository URL required",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate GitHub API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock repository analysis
      const mockFiles: UploadedFile[] = [
        {
          name: "App.tsx",
          content: `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;`,
          type: 'file',
          path: 'src/App.tsx'
        },
        {
          name: "api.ts",
          content: `const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const fetchUser = async (id: string) => {
  const response = await fetch(\`\${API_BASE}/users/\${id}\`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

export const createUser = async (userData: any) => {
  const response = await fetch(\`\${API_BASE}/users\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};`,
          type: 'file',
          path: 'src/utils/api.ts'
        },
        {
          name: "database.py",
          content: `import sqlite3
from typing import List, Dict, Optional

class Database:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.init_tables()
    
    def init_tables(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
    
    def get_user(self, user_id: int) -> Optional[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            row = cursor.fetchone()
            if row:
                return {'id': row[0], 'name': row[1], 'email': row[2], 'created_at': row[3]}
        return None`,
          type: 'file',
          path: 'backend/database.py'
        }
      ];

      onFilesUploaded(mockFiles);
      setIsConnected(true);
      
      toast({
        title: "Repository connected successfully",
        description: `Analyzed ${mockFiles.length} files from ${extractRepoName(repoUrl)}`,
      });
      
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to the repository. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractRepoName = (url: string): string => {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    return match ? match[1] : url;
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRepoUrl("");
    setBranch("main");
  };

  if (isConnected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">{extractRepoName(repoUrl)}</span>
          </div>
          <Badge variant="secondary" className="bg-success/20 text-success">
            Connected
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Repository successfully connected and analyzed. Files are ready for visualization.
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(repoUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              View on GitHub
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="repo-url">Repository URL</Label>
        <Input
          id="repo-url"
          placeholder="https://github.com/username/repository"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="input-glow"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Input
          id="branch"
          placeholder="main"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="input-glow"
        />
      </div>
      
      <Button
        onClick={handleConnect}
        disabled={isLoading || !repoUrl.trim()}
        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
      >
        {isLoading ? (
          <>
            <Download className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Github className="h-4 w-4 mr-2" />
            Connect Repository
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground">
        Connect your GitHub repository to automatically analyze code structure and generate visualizations.
      </p>
    </div>
  );
};