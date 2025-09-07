import { useState, useEffect } from "react";
import { 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, 
  Quote, Minus, Code2, 
  Image as ImageIcon, Video, FileIcon, Link2,
  Table, CheckSquare, Lightbulb,
  Palette, Hash, AtSign,
  Sparkles, MessageSquare, Search,
  Calendar, Vote, Users, 
  Database, Columns, Eye,
  Calculator, Shield, GitBranch,
  PieChart, BarChart, Map,
  Zap, Clock, Tag,
  FileText, Bookmark, Layers,
  Network, Brain, Workflow
} from "lucide-react";
import { Command, CommandInput, CommandItem, CommandList, CommandGroup } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SlashCommand {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  keywords: string[];
  category: 'suggested' | 'basic' | 'media' | 'database' | 'ai' | 'advanced' | 'professional' | 'collaboration' | 'visual';
  action: () => void;
  isNew?: boolean;
}

interface SlashCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: SlashCommand) => void;
  position: { top: number; left: number };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SlashCommandMenu = ({
  isOpen,
  onClose,
  onCommand,
  position,
  searchQuery,
  onSearchChange
}: SlashCommandMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([]);

  const commands: SlashCommand[] = [
    // Suggested
    {
      id: 'enhanced-code',
      title: 'Enhanced Code Block',
      description: 'Code with language selection and filename',
      icon: Code2,
      keywords: ['code', 'programming', 'enhanced', 'language'],
      category: 'suggested',
      action: () => {},
      isNew: true
    },
    {
      id: 'bulleted-list',
      title: 'Bulleted List',
      description: 'Create a simple bulleted list',
      icon: List,
      keywords: ['list', 'bullet', 'ul'],
      category: 'suggested',
      action: () => {}
    },
    {
      id: 'checklist',
      title: 'Interactive Checklist',
      description: 'Task list with completion tracking',
      icon: CheckSquare,
      keywords: ['todo', 'task', 'checkbox', 'check', 'interactive'],
      category: 'suggested',
      action: () => {},
      isNew: true
    },
    {
      id: 'divider',
      title: 'Divider',
      description: 'Visually divide blocks',
      icon: Minus,
      keywords: ['divider', 'separator', 'hr'],
      category: 'suggested',
      action: () => {}
    },
    {
      id: 'heading-2',
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: Heading2,
      keywords: ['heading', 'h2', 'title'],
      category: 'suggested',
      action: () => {}
    },

    // Basic blocks
    {
      id: 'text',
      title: 'Text',
      description: 'Just start writing with plain text',
      icon: Hash,
      keywords: ['text', 'paragraph', 'plain'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'heading-1',
      title: 'Heading 1',
      description: 'Big section heading',
      icon: Heading1,
      keywords: ['heading', 'h1', 'title', 'large'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'heading-3',
      title: 'Heading 3',
      description: 'Small section heading',
      icon: Heading3,
      keywords: ['heading', 'h3', 'title', 'small'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'numbered-list',
      title: 'Numbered List',
      description: 'Create a list with numbering',
      icon: ListOrdered,
      keywords: ['list', 'numbered', 'ordered', 'ol'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Capture a quote',
      icon: Quote,
      keywords: ['quote', 'blockquote', 'citation'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'callout',
      title: 'Callout',
      description: 'Make writing stand out',
      icon: Lightbulb,
      keywords: ['callout', 'note', 'info', 'warning'],
      category: 'basic',
      action: () => {}
    },
    {
      id: 'link',
      title: 'Link',
      description: 'Add a hyperlink',
      icon: Link2,
      keywords: ['link', 'url', 'hyperlink'],
      category: 'basic',
      action: () => {}
    },

    // Visual & Layout
    {
      id: 'columns',
      title: 'Columns',
      description: 'Side-by-side content layout',
      icon: Columns,
      keywords: ['columns', 'layout', 'side by side'],
      category: 'visual',
      action: () => {},
      isNew: true
    },
    {
      id: 'collapse',
      title: 'Collapsible Section',
      description: 'Expand/collapse content sections',
      icon: Eye,
      keywords: ['collapse', 'expand', 'toggle', 'accordion'],
      category: 'visual',
      action: () => {},
      isNew: true
    },
    {
      id: 'status-tag',
      title: 'Status Tag',
      description: 'Colored status labels',
      icon: Tag,
      keywords: ['status', 'tag', 'label', 'badge'],
      category: 'visual',
      action: () => {},
      isNew: true
    },

    // Media
    {
      id: 'image',
      title: 'Image',
      description: 'Upload or embed with a link',
      icon: ImageIcon,
      keywords: ['image', 'picture', 'photo', 'upload'],
      category: 'media',
      action: () => {}
    },
    {
      id: 'gallery',
      title: 'Image Gallery',
      description: 'Multiple images with lightbox',
      icon: Layers,
      keywords: ['gallery', 'images', 'photos', 'lightbox'],
      category: 'media',
      action: () => {},
      isNew: true
    },
    {
      id: 'video',
      title: 'Video',
      description: 'Embed a video',
      icon: Video,
      keywords: ['video', 'embed', 'youtube', 'vimeo'],
      category: 'media',
      action: () => {}
    },
    {
      id: 'file',
      title: 'File Attachment',
      description: 'Upload a file with preview',
      icon: FileIcon,
      keywords: ['file', 'upload', 'attachment', 'pdf'],
      category: 'media',
      action: () => {}
    },
    {
      id: 'bookmark',
      title: 'Web Bookmark',
      description: 'Save a link to any web page',
      icon: Bookmark,
      keywords: ['bookmark', 'link', 'url', 'web'],
      category: 'media',
      action: () => {}
    },

    // Database & Organization
    {
      id: 'table',
      title: 'Advanced Table',
      description: 'Editable table with formatting',
      icon: Table,
      keywords: ['table', 'grid', 'data', 'spreadsheet'],
      category: 'database',
      action: () => {}
    },
    {
      id: 'board',
      title: 'Kanban Board',
      description: 'Project board with drag/drop cards',
      icon: BarChart,
      keywords: ['board', 'kanban', 'project', 'cards'],
      category: 'database',
      action: () => {},
      isNew: true
    },
    {
      id: 'database-view',
      title: 'Database View',
      description: 'Structured data with filters',
      icon: Database,
      keywords: ['database', 'data', 'filter', 'sort'],
      category: 'database',
      action: () => {},
      isNew: true
    },

    // Collaboration & Scheduling
    {
      id: 'calendar',
      title: 'Calendar',
      description: 'Interactive calendar and scheduling',
      icon: Calendar,
      keywords: ['calendar', 'schedule', 'date', 'event'],
      category: 'collaboration',
      action: () => {},
      isNew: true
    },
    {
      id: 'vote',
      title: 'Voting Poll',
      description: 'Create polls with live results',
      icon: Vote,
      keywords: ['vote', 'poll', 'survey', 'feedback'],
      category: 'collaboration',
      action: () => {},
      isNew: true
    },
    {
      id: 'mention',
      title: 'Mention User',
      description: 'Tag users with notifications',
      icon: AtSign,
      keywords: ['mention', 'tag', 'user', 'notify'],
      category: 'collaboration',
      action: () => {},
      isNew: true
    },
    {
      id: 'checkin',
      title: 'Check-in Tracker',
      description: 'Attendance and presence tracking',
      icon: Users,
      keywords: ['checkin', 'attendance', 'presence', 'track'],
      category: 'collaboration',
      action: () => {},
      isNew: true
    },

    // Professional & Advanced
    {
      id: 'formula',
      title: 'Math Formula',
      description: 'LaTeX formula rendering',
      icon: Calculator,
      keywords: ['formula', 'math', 'latex', 'equation'],
      category: 'professional',
      action: () => {},
      isNew: true
    },
    {
      id: 'prd-template',
      title: 'PRD Template',
      description: 'Product Requirements Document template',
      icon: FileText,
      keywords: ['prd', 'product', 'requirements', 'template'],
      category: 'professional',
      action: () => {},
      isNew: true
    },
    {
      id: 'encrypted-text',
      title: 'Encrypted Content',
      description: 'Password-protected text blocks',
      icon: Shield,
      keywords: ['encrypted', 'secure', 'password', 'private'],
      category: 'professional',
      action: () => {},
      isNew: true
    },

    // Diagramming & Visual
    {
      id: 'flowchart',
      title: 'Flowchart',
      description: 'Process flow and decision diagrams',
      icon: Workflow,
      keywords: ['flowchart', 'process', 'diagram', 'workflow'],
      category: 'visual',
      action: () => {},
      isNew: true
    },
    {
      id: 'mindmap',
      title: 'Mind Map',
      description: 'Brainstorm ideas with connected nodes',
      icon: Brain,
      keywords: ['mindmap', 'brainstorm', 'ideas', 'nodes'],
      category: 'visual',
      action: () => {},
      isNew: true
    },
    {
      id: 'uml',
      title: 'UML Diagram',
      description: 'Unified Modeling Language diagrams',
      icon: Network,
      keywords: ['uml', 'diagram', 'modeling', 'class'],
      category: 'visual',
      action: () => {},
      isNew: true
    },
    {
      id: 'chart',
      title: 'Charts & Graphs',
      description: 'Data visualization charts',
      icon: PieChart,
      keywords: ['chart', 'graph', 'data', 'visualization'],
      category: 'visual',
      action: () => {},
      isNew: true
    },

    // AI Enhanced
    {
      id: 'ai-summary',
      title: 'AI Summary',
      description: 'Summarize content above with AI',
      icon: Sparkles,
      keywords: ['ai', 'summary', 'summarize'],
      category: 'ai',
      action: () => {}
    },
    {
      id: 'ai-explain',
      title: 'AI Explain',
      description: 'Explain selected code or text',
      icon: MessageSquare,
      keywords: ['ai', 'explain', 'code', 'help'],
      category: 'ai',
      action: () => {}
    },
    {
      id: 'ai-improve',
      title: 'AI Improve',
      description: 'Enhance writing with AI suggestions',
      icon: Zap,
      keywords: ['ai', 'improve', 'enhance', 'suggestions'],
      category: 'ai',
      action: () => {},
      isNew: true
    }
  ];

  useEffect(() => {
    const filtered = commands.filter(command => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return command.title.toLowerCase().includes(query) ||
             command.description.toLowerCase().includes(query) ||
             command.keywords.some(keyword => keyword.includes(query));
    });
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        onCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const groupedCommands = {
    suggested: filteredCommands.filter(cmd => cmd.category === 'suggested'),
    basic: filteredCommands.filter(cmd => cmd.category === 'basic'),
    visual: filteredCommands.filter(cmd => cmd.category === 'visual'),
    media: filteredCommands.filter(cmd => cmd.category === 'media'),
    database: filteredCommands.filter(cmd => cmd.category === 'database'),
    collaboration: filteredCommands.filter(cmd => cmd.category === 'collaboration'),
    professional: filteredCommands.filter(cmd => cmd.category === 'professional'),
    advanced: filteredCommands.filter(cmd => cmd.category === 'advanced'),
    ai: filteredCommands.filter(cmd => cmd.category === 'ai')
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 w-80 bg-popover border border-border rounded-lg shadow-lg"
      style={{
        top: position.top,
        left: position.left,
      }}
      onKeyDown={handleKeyDown}
    >
      <Command className="bg-transparent">
        <div className="px-3 py-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <CommandInput
              placeholder="Filter..."
              value={searchQuery}
              onValueChange={onSearchChange}
              className="pl-8 h-8 text-sm bg-input border-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>

        <CommandList className="max-h-96 overflow-y-auto">
          {/* Demo Mode Indicator */}
          <div className="px-3 py-2 border-b border-border bg-muted/20">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                DEMO MODE
              </Badge>
              <span className="text-xs text-muted-foreground">
                Enhanced slash commands for API Documentation
              </span>
            </div>
          </div>

          {Object.entries(groupedCommands).map(([category, commands]) => 
            commands.length > 0 && (
              <CommandGroup 
                key={category} 
                heading={category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')} 
                className="px-2"
              >
                {commands.map((command) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  return (
                    <CommandItem
                      key={command.id}
                      onSelect={() => onCommand(command)}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 cursor-pointer rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        globalIndex === selectedIndex && "bg-accent text-accent-foreground"
                      )}
                    >
                      <command.icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm text-foreground">{command.title}</div>
                          {command.isNew && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-400 text-xs">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{command.description}</div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )
          )}
        </CommandList>
      </Command>
    </div>
  );
};