import { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code,
  Heading1, Heading2, Heading3,
  Link2, ImageIcon, Palette, Highlighter,
  Undo, Redo, Languages,
  IndentIncrease, IndentDecrease,
  Type, Plus, Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorPicker } from "@/components/ColorPicker";
import { cn } from "@/lib/utils";

interface RichFormattingToolbarProps {
  editor: Editor;
}

const FONT_FAMILIES = [
  { label: 'Inter (Default)', value: 'Inter, -apple-system, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Times New Roman', value: 'Times, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Monaco', value: 'Monaco, Consolas, monospace' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' }
];

const FONT_SIZES = [
  '8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px', '16px', 
  '18px', '20px', '22px', '24px', '28px', '32px', '36px', '42px', '48px', '72px'
];

const HEADING_STYLES = [
  { label: 'Normal Text', value: 'paragraph', command: () => {} },
  { label: 'Title', value: 'title', command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: 'Heading 1', value: 'h1', command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: 'Heading 2', value: 'h2', command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: 'Heading 3', value: 'h3', command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  { label: 'Quote', value: 'quote', command: (editor: Editor) => editor.chain().focus().toggleBlockquote().run() },
  { label: 'Code Block', value: 'code', command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run() }
];

const LANGUAGES = [
  { label: 'English', value: 'en', flag: '🇺🇸' },
  { label: 'Spanish', value: 'es', flag: '🇪🇸' },
  { label: 'French', value: 'fr', flag: '🇫🇷' },
  { label: 'German', value: 'de', flag: '🇩🇪' },
  { label: 'Chinese', value: 'zh', flag: '🇨🇳' },
  { label: 'Japanese', value: 'ja', flag: '🇯🇵' },
  { label: 'Portuguese', value: 'pt', flag: '🇵🇹' },
  { label: 'Russian', value: 'ru', flag: '🇷🇺' }
];

export const RichFormattingToolbar = ({ editor }: RichFormattingToolbarProps) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('16px');

  if (!editor) return null;

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    // Apply font size styling - TipTap doesn't have built-in fontSize
    editor.chain().focus().run();
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    // In a real implementation, this would trigger translation
    console.log('Translating to:', language);
  };

  return (
    <div className="border-b border-border bg-card">
      <div className="p-3 space-y-3">
        {/* First Row: Font, Size, and Styles */}
        <div className="flex items-center gap-2">
          {/* Font Family */}
          <Select defaultValue="Inter, -apple-system, sans-serif">
            <SelectTrigger className="w-[180px] h-8 text-sm bg-input border-border">
              <SelectValue placeholder="Font Family" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value} className="text-sm">
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font Size */}
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
            <SelectTrigger className="w-[80px] h-8 text-sm bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {FONT_SIZES.map((size) => (
                <SelectItem key={size} value={size} className="text-sm">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          {/* Style Selector */}
          <Select>
            <SelectTrigger className="w-[140px] h-8 text-sm bg-input border-border">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {HEADING_STYLES.map((style) => (
                <SelectItem 
                  key={style.value} 
                  value={style.value} 
                  className="text-sm cursor-pointer"
                  onSelect={() => style.command(editor)}
                >
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          {/* Translation Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3">
                <Languages className="h-4 w-4 mr-2" />
                Translation
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover border-border">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.value}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={cn(
                    "cursor-pointer",
                    currentLanguage === lang.value && "bg-accent"
                  )}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Second Row: Text Formatting */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0 hover:bg-muted",
              editor.isActive('bold') && "bg-muted text-primary"
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0 hover:bg-muted",
              editor.isActive('italic') && "bg-muted text-primary"
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-8 w-8 p-0 hover:bg-muted",
              editor.isActive('underline') && "bg-muted text-primary"
            )}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              "h-8 w-8 p-0 hover:bg-muted",
              editor.isActive('strike') && "bg-muted text-primary"
            )}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Colors */}
          <ColorPicker
            onColorSelect={(color) => editor.chain().focus().setColor(color).run()}
            currentColor={editor.getAttributes('textStyle').color}
          />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Lists and Indentation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-8 w-8 p-0 hover:bg-muted",
              editor.isActive('bulletList') && "bg-muted text-primary"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-8 w-8 p-0 hover:bg-muted",
              editor.isActive('orderedList') && "bg-muted text-primary"
            )}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <IndentDecrease className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <IndentIncrease className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Insert Elements */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('Enter link URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('Enter image URL:');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};