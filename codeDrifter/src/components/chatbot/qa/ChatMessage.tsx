import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={cn(
      "flex gap-3 max-w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        "rounded-lg px-4 py-3 max-w-2xl break-words",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-foreground"
      )}>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
          <User className="h-4 w-4 text-accent-foreground" />
        </div>
      )}
    </div>
  );
};