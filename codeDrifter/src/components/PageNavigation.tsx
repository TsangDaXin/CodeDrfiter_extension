import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash,
  Copy,
  FolderPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PageItem {
  id: string;
  title: string;
  isActive: boolean;
  hasChildren: boolean;
  isExpanded?: boolean;
  level: number;
  parentId?: string;
}

interface PageNavigationProps {
  pages: PageItem[];
  onPageSelect: (pageId: string) => void;
  onPageAdd: (parentId?: string) => void;
  onPageDelete: (pageId: string) => void;
  onPageRename: (pageId: string, newTitle: string) => void;
  onPageDuplicate: (pageId: string) => void;
  className?: string;
}

export const PageNavigation = ({
  pages,
  onPageSelect,
  onPageAdd,
  onPageDelete,
  onPageRename,
  onPageDuplicate,
  className
}: PageNavigationProps) => {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  const handleEdit = (pageId: string, currentTitle: string) => {
    setEditingPageId(pageId);
    setEditingTitle(currentTitle);
  };

  const handleSaveEdit = () => {
    if (editingPageId && editingTitle.trim()) {
      onPageRename(editingPageId, editingTitle.trim());
    }
    setEditingPageId(null);
    setEditingTitle("");
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditingTitle("");
  };

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const getVisiblePages = () => {
    const visiblePages: PageItem[] = [];
    
    const addPageAndChildren = (page: PageItem) => {
      visiblePages.push(page);
      
      if (page.hasChildren && expandedPages.has(page.id)) {
        const children = pages.filter(p => p.parentId === page.id);
        children.forEach(child => addPageAndChildren(child));
      }
    };

    // Add root level pages
    const rootPages = pages.filter(p => !p.parentId);
    rootPages.forEach(page => addPageAndChildren(page));
    
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("w-64 border-r border-border bg-card", className)}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm">Pages</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageAdd()}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Organize your documentation into pages and sections
        </p>
      </div>

      <div className="p-2">
        <div className="space-y-1">
          {visiblePages.map((page) => (
            <div key={page.id} className="group">
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                  page.isActive && "bg-primary/10 text-primary"
                )}
                style={{ marginLeft: `${page.level * 12}px` }}
              >
                {/* Expand/Collapse Button */}
                {page.hasChildren ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(page.id);
                    }}
                    className="h-4 w-4 p-0 hover:bg-muted"
                  >
                    {expandedPages.has(page.id) ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </Button>
                ) : (
                  <div className="w-4" />
                )}

                {/* Page Icon */}
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />

                {/* Page Title (Editable) */}
                {editingPageId === page.id ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveEdit();
                      } else if (e.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                    className="h-5 px-1 py-0 text-xs bg-input border-border"
                    autoFocus
                  />
                ) : (
                  <span
                    className={cn(
                      "flex-1 text-sm truncate",
                      page.isActive ? "text-primary font-medium" : "text-foreground"
                    )}
                    onClick={() => onPageSelect(page.id)}
                  >
                    {page.title}
                  </span>
                )}

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity",
                        editingPageId === page.id && "opacity-0 pointer-events-none"
                      )}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem
                      onClick={() => handleEdit(page.id, page.title)}
                      className="text-sm cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onPageDuplicate(page.id)}
                      className="text-sm cursor-pointer"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onPageAdd(page.id)}
                      className="text-sm cursor-pointer"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Add Subpage
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onPageDelete(page.id)}
                      className="text-sm cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {/* Add Page Buttons */}
        <div className="mt-4 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageAdd()}
            className="w-full justify-start text-xs h-7 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3 w-3 mr-2" />
            Add Page
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const activePage = pages.find(p => p.isActive);
              onPageAdd(activePage?.id);
            }}
            className="w-full justify-start text-xs h-7 text-muted-foreground hover:text-foreground"
          >
            <FolderPlus className="h-3 w-3 mr-2" />
            Add Subpage
          </Button>
        </div>
      </div>
    </div>
  );
};