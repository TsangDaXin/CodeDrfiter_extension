import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={cn(
      "flex gap-3 max-w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        "rounded-lg px-4 py-3 max-w-[280px] break-words",
        isUser 
          ? "bg-primary text-primary-foreground ml-8" 
          : "bg-muted text-foreground"
      )}>
        <div className="text-sm whitespace-pre-wrap">
          {message.content}
        </div>
        <div className={cn(
          "text-xs mt-1 opacity-70",
          isUser ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-accent-foreground" />
        </div>
      )}
    </div>
  );
};