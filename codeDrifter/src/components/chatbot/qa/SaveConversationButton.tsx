import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SaveConversationButtonProps {
  messages: Message[];
}

export const SaveConversationButton = ({ messages }: SaveConversationButtonProps) => {
  const { toast } = useToast();

  const handleSaveConversation = () => {
    if (messages.length === 0) {
      toast({
        title: "No conversation to save",
        description: "Start a conversation first, then save it.",
        variant: "destructive"
      });
      return;
    }

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

    toast({
      title: "Conversation saved",
      description: "Your conversation has been downloaded as a text file.",
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSaveConversation}
      disabled={messages.length === 0}
      className="flex items-center gap-2 h-9"
      title="Save conversation"
    >
      <Save className="h-4 w-4" />
      <span className="hidden sm:inline">Save</span>
    </Button>
  );
};