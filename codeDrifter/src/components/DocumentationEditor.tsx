import { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Heading1,
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  ImageIcon,
  Save,
  Share2,
  Users,
  ArrowLeft,
  Eye,
  EyeOff,
  MessageSquare,
  Send,
  Sparkles,
  MoreHorizontal,
  Copy,
  Edit,
  Trash,
  Bot,
  Settings,
  FileText,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DocumentTabs } from "@/components/DocumentTab";
import { SlashCommandMenu } from "@/components/SlashCommandMenu";
import { CollaboratorCursors, CollaboratorSelections } from "@/components/CollaboratorCursors";
import { ColorPicker } from "@/components/ColorPicker";
import { AIAssistantPanel } from "@/components/collaborative/AIAssistantPanel";
import { CommentsPanel } from "@/components/collaborative/CommentsPanel";
import { SharingPanel } from "@/components/collaborative/SharingPanel";
import { CollaboratorPresence } from "@/components/collaborative/CollaboratorPresence";
import { RichFormattingToolbar } from "@/components/RichFormattingToolbar";
import { PageNavigation } from "@/components/PageNavigation";
import { cn } from "@/lib/utils";

interface DocumentationEditorProps {
  documentId: string;
  onBack: () => void;
}

interface DocumentTab {
  id: string;
  title: string;
  isActive: boolean;
  isDirty: boolean;
  content: string;
}

interface PageItem {
  id: string;
  title: string;
  isActive: boolean;
  hasChildren: boolean;
  isExpanded?: boolean;
  level: number;
  parentId?: string;
}

const collaborators = [
  { id: "1", name: "Sarah Chen", avatar: "SC", color: "#3B82F6" }
];

const aiSuggestions = [
  "Add API endpoint documentation",
  "Include code examples",
  "Explain error handling",
  "Add authentication flow"
];

const chatMessages = [
  { id: "1", user: "AI Assistant", message: "I've analyzed your code changes. Would you like me to generate documentation for the new API endpoints?", isAi: true },
  { id: "2", user: "You", message: "Yes, please focus on the authentication endpoints", isAi: false },
  { id: "3", user: "AI Assistant", message: "Here's a summary of the auth endpoints with examples. Should I add error handling documentation?", isAi: true }
];

export const DocumentationEditor = ({ documentId, onBack }: DocumentationEditorProps) => {
  const [showSummary, setShowSummary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [showPageNav, setShowPageNav] = useState(true);
  
  // Tab management
  const [tabs, setTabs] = useState<DocumentTab[]>([
    {
      id: "1",
      title: documentId.startsWith("summary-") ? "AI Generated Summary" : "API Documentation",
      isActive: true,
      isDirty: false,
      content: documentId.startsWith("summary-") ? `
        <h1>AI Generated Summary</h1>
        <p>This is your AI-generated summary document. You can edit the content, add formatting, and enhance it with additional information.</p>
        
        <h2>Summary Content</h2>
        <p>The AI has provided a concise overview of your documentation. You can now:</p>
        <ul>
          <li>Edit the summary text</li>
          <li>Add additional sections</li>
          <li>Apply rich formatting</li>
          <li>Include images and links</li>
          <li>Collaborate with team members</li>
        </ul>
        
        <h2>Next Steps</h2>
        <p>Use the toolbar above to format your content and the AI assistant to help expand sections.</p>
      ` : `
        <h1>API Documentation</h1>
        <p>This document outlines the REST API endpoints and authentication flow for our application.</p>
        
        <h2>Authentication</h2>
        <p>All API requests require authentication using Bearer tokens. Include the token in the Authorization header:</p>
        
        <h3>Login Endpoint</h3>
        <p><strong>POST /api/auth/login</strong></p>
        <p>Authenticates a user and returns an access token.</p>
        
        <h2>User Management</h2>
        <p>Endpoints for managing user accounts and profiles.</p>
      `
    }
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  
  // Page management
  const [pages, setPages] = useState<PageItem[]>([
    { id: "1", title: "Introduction", isActive: true, hasChildren: true, level: 0 },
    { id: "2", title: "Getting Started", isActive: false, hasChildren: false, level: 1, parentId: "1" },
    { id: "3", title: "Installation", isActive: false, hasChildren: false, level: 1, parentId: "1" },
    { id: "4", title: "API Reference", isActive: false, hasChildren: true, level: 0 },
    { id: "5", title: "Authentication", isActive: false, hasChildren: false, level: 1, parentId: "4" },
    { id: "6", title: "Endpoints", isActive: false, hasChildren: false, level: 1, parentId: "4" }
  ]);
  const [activePageId, setActivePageId] = useState("1");
  
  // Slash command menu
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [slashSearchQuery, setSlashSearchQuery] = useState("");
  
  // Collaboration  
  const [cursorPositions, setCursorPositions] = useState([]);
  const [selections, setSelections] = useState([]);
  
  // Context menu
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  
  const editorRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextStyle,
      Color,
      Underline,
      Strike,
    ],
    content: activeTab?.content || "",
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[500px] focus:outline-none p-6',
      },
      handleKeyDown: (view, event) => {
        // Handle slash command
        if (event.key === '/') {
          const { selection } = view.state;
          const { from } = selection;
          const coords = view.coordsAtPos(from);
          
          setTimeout(() => {
            setSlashMenuPosition({ top: coords.top + 20, left: coords.left });
            setShowSlashMenu(true);
            setSlashSearchQuery("");
          }, 0);
        }
        
        // Hide slash menu on other keys
        if (showSlashMenu && event.key !== '/' && event.key !== 'Backspace') {
          if (event.key === 'Escape') {
            setShowSlashMenu(false);
            return true;
          }
        }
        
        return false;
      },
      handleTextInput: (view, from, to, text) => {
        if (showSlashMenu && text !== '/') {
          setSlashSearchQuery(prev => prev + text);
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      // Mark tab as dirty
      setTabs(prev => prev.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, isDirty: true, content: editor.getHTML() }
          : tab
      ));
    },
  });

  // Tab management functions
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: tab.id === tabId })));
  };

  const handleTabClose = (tabId: string) => {
    if (tabs.length === 1) return; // Don't close last tab
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId) {
      const newActiveTab = newTabs[0];
      setActiveTabId(newActiveTab.id);
    }
  };

  const handleTabRename = (tabId: string, newTitle: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, title: newTitle } : tab
    ));
  };

  const handleNewTab = () => {
    const newTab: DocumentTab = {
      id: Date.now().toString(),
      title: "Untitled Document",
      isActive: true,
      isDirty: false,
      content: "<h1>New Document</h1><p>Start writing...</p>"
    };
    
    setTabs(prev => [...prev.map(tab => ({ ...tab, isActive: false })), newTab]);
    setActiveTabId(newTab.id);
  };

  // Slash command handling
  const handleSlashCommand = (command: any) => {
    if (!editor) return;
    
    setShowSlashMenu(false);
    
    // Remove the "/" character
    const { selection } = editor.state;
    const { from } = selection;
    editor.chain().focus().deleteRange({ from: from - 1, to: from }).run();
    
    // Execute command based on type
    switch (command.id) {
      case 'heading-1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'heading-2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading-3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'bulleted-list':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'numbered-list':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'code':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'divider':
        editor.chain().focus().setHorizontalRule().run();
        break;
      case 'image':
        const url = window.prompt('Enter image URL:');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
        break;
      case 'callout':
        editor.chain().focus().insertContent('<div class="callout"><p>💡 Important note</p></div>').run();
        break;
      default:
        editor.chain().focus().insertContent(`<p>${command.title} block</p>`).run();
    }
  };

  // Context menu for text selection
  const handleTextSelection = () => {
    if (!editor) return;
    
    const { selection } = editor.state;
    const text = editor.state.doc.textBetween(selection.from, selection.to);
    
    if (text.length > 0) {
      setSelectedText(text);
      const coords = editor.view.coordsAtPos(selection.from);
      setContextMenuPosition({ top: coords.top - 40, left: coords.left });
      setShowContextMenu(true);
    } else {
      setShowContextMenu(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mark current tab as saved
    setTabs(prev => prev.map(tab => 
      tab.id === activeTabId ? { ...tab, isDirty: false } : tab
    ));
    
    setIsSaving(false);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatInput("");
    // Add message logic here
  };

  // Page management functions
  const handlePageSelect = (pageId: string) => {
    setActivePageId(pageId);
    setPages(prev => prev.map(page => ({ ...page, isActive: page.id === pageId })));
  };

  const handlePageAdd = (parentId?: string) => {
    const newPage: PageItem = {
      id: Date.now().toString(),
      title: "New Page",
      isActive: false,
      hasChildren: false,
      level: parentId ? (pages.find(p => p.id === parentId)?.level || 0) + 1 : 0,
      parentId
    };
    setPages(prev => [...prev, newPage]);
  };

  const handlePageDelete = (pageId: string) => {
    setPages(prev => prev.filter(page => page.id !== pageId && page.parentId !== pageId));
  };

  const handlePageRename = (pageId: string, newTitle: string) => {
    setPages(prev => prev.map(page => 
      page.id === pageId ? { ...page, title: newTitle } : page
    ));
  };

  const handlePageDuplicate = (pageId: string) => {
    const pageToClone = pages.find(p => p.id === pageId);
    if (pageToClone) {
      const newPage: PageItem = {
        ...pageToClone,
        id: Date.now().toString(),
        title: `${pageToClone.title} (Copy)`,
        isActive: false
      };
      setPages(prev => [...prev, newPage]);
    }
  };

  // Update editor content when switching tabs
  useEffect(() => {
    if (editor && activeTab) {
      editor.commands.setContent(activeTab.content);
    }
  }, [activeTabId, editor]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSlashMenu) {
        setShowSlashMenu(false);
      }
      if (showContextMenu) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSlashMenu, showContextMenu]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 flex h-screen bg-background" ref={editorRef}>
      <CollaboratorCursors collaborators={collaborators} cursorPositions={cursorPositions} />
      <CollaboratorSelections collaborators={collaborators} selections={selections} />
      
      {/* Page Navigation */}
      {showPageNav && (
        <PageNavigation
          pages={pages}
          onPageSelect={handlePageSelect}
          onPageAdd={handlePageAdd}
          onPageDelete={handlePageDelete}
          onPageRename={handlePageRename}
          onPageDuplicate={handlePageDuplicate}
        />
      )}
      
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Document Tabs */}
        <DocumentTabs
          tabs={tabs}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onTabRename={handleTabRename}
          onNewTab={handleNewTab}
        />
        
        {/* Collaborator Presence */}
        <CollaboratorPresence className="mx-4 mt-4" />

        {/* Header */}
        <div className="border-b border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to History
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPageNav(!showPageNav)}
                className="hover:bg-muted"
              >
                <FileText className="h-4 w-4 mr-2" />
                {showPageNav ? 'Hide' : 'Show'} Pages
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl font-semibold text-foreground">{activeTab?.title || "Untitled"}</h1>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                Live
              </Badge>
              {documentId.startsWith("summary-") ? (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                  AI SUMMARY
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  DEMO MODE
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Collaborators */}
              <div className="flex -space-x-2">
                {collaborators.map((collaborator) => (
                  <Avatar key={collaborator.id} className="h-8 w-8 border-2 border-background" style={{ backgroundColor: collaborator.color }}>
                    <span className="text-xs font-medium text-white">{collaborator.avatar}</span>
                  </Avatar>
                ))}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2 hover:bg-muted">
                  <Users className="h-4 w-4" />
                </Button>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSummary(!showSummary)}
                className="border-border hover:bg-muted"
              >
                {showSummary ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showSummary ? "Hide Summary" : "Show Summary"}
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="border-border hover:bg-muted"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSharing(!showSharing)}
                className="border-border hover:bg-muted"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAI(!showAI)}
                className="border-border hover:bg-muted"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>

              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Editor Toolbar & Content */}
          <div className="flex-1 flex flex-col">
            {/* Rich Formatting Toolbar */}
            <RichFormattingToolbar editor={editor} />

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto relative">
              <div className="max-w-4xl mx-auto" onMouseUp={handleTextSelection}>
                <EditorContent editor={editor} />
              </div>
              
              {/* Slash Command Menu */}
              <SlashCommandMenu
                isOpen={showSlashMenu}
                onClose={() => setShowSlashMenu(false)}
                onCommand={handleSlashCommand}
                position={slashMenuPosition}
                searchQuery={slashSearchQuery}
                onSearchChange={setSlashSearchQuery}
              />
              
              {/* Context Menu for Text Selection */}
              {showContextMenu && (
                <DropdownMenu open={showContextMenu} onOpenChange={setShowContextMenu}>
                  <DropdownMenuTrigger asChild>
                    <div
                      className="absolute w-1 h-1"
                      style={{
                        top: contextMenuPosition.top,
                        left: contextMenuPosition.left,
                      }}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover border border-border">
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(selectedText)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Summarize
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      AI Improve
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      AI Explain
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Summary Panel */}
          {showSummary && (
            <div className="w-80 border-l border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-4">Documentation Summary</h3>
              <div className="space-y-3">
                <Card className="p-3 bg-gradient-card border-border">
                  <h4 className="font-medium text-foreground text-sm mb-2">Auto-generated from code</h4>
                  <p className="text-xs text-muted-foreground">
                    15 API endpoints detected, 8 new since last version
                  </p>
                </Card>
                <Card className="p-3 bg-gradient-card border-border">
                  <h4 className="font-medium text-foreground text-sm mb-2">Key Changes</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Added OAuth 2.0 support</li>
                    <li>• New user management endpoints</li>
                    <li>• Updated error response format</li>
                  </ul>
                </Card>
                <Card className="p-3 bg-gradient-card border-border">
                  <h4 className="font-medium text-foreground text-sm mb-2">AI Suggestions</h4>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full text-left text-xs justify-start hover:bg-muted"
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side Panels */}
      {showAI && (
        <AIAssistantPanel 
          isOpen={showAI} 
          onClose={() => setShowAI(false)} 
        />
      )}

      {showComments && (
        <CommentsPanel 
          isOpen={showComments} 
          onClose={() => setShowComments(false)} 
        />
      )}

      {showSharing && (
        <SharingPanel 
          isOpen={showSharing} 
          onClose={() => setShowSharing(false)} 
        />
      )}
    </div>
  );
};