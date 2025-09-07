import { Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SaveConversationProps {
  messages: Message[];
}

export const SaveConversation = ({ messages }: SaveConversationProps) => {
  const handleSaveConversation = () => {
    if (messages.length === 0) return;

    const conversationText = messages
      .map(message => {
        const timestamp = message.timestamp.toLocaleString();
        const speaker = message.type === 'user' ? 'You' : 'CodeDrifer GPT';
        return `[${timestamp}] ${speaker}: ${message.content}`;
      })
      .join('\n\n');

    const header = `CodeDrifer GPT Conversation\nExported: ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`;
    const fullContent = header + conversationText;

    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codedrifer-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSaveConversation}
      disabled={messages.length === 0}
      className="h-8 w-8 p-0 hover:bg-muted"
      title="Save conversation"
    >
      <Save className="h-4 w-4" />
    </Button>
  );
};