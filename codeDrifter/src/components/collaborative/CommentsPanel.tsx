import { useState } from "react";
import { MessageSquare, MoreHorizontal, Heart, ThumbsUp, Reply, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
  reactions: { type: string; count: number; users: string[] }[];
}

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoComments: Comment[] = [
  {
    id: "1",
    author: "Sarah Chen",
    avatar: "SC",
    content: "The authentication section looks great! Should we add rate limiting information for the login endpoint?",
    timestamp: "2 hours ago",
    reactions: [
      { type: "👍", count: 2, users: ["Mike Wilson", "Alex Rivera"] },
      { type: "💡", count: 1, users: ["Mike Wilson"] }
    ],
    replies: [
      {
        id: "1a",
        author: "Mike Wilson", 
        avatar: "MW",
        content: "Good point! I'll add a section about rate limits. We should also mention the retry-after header.",
        timestamp: "1 hour ago",
        reactions: [
          { type: "👍", count: 1, users: ["Sarah Chen"] }
        ]
      }
    ]
  },
  {
    id: "2",
    author: "Alex Rivera",
    avatar: "AR", 
    content: "Can we add examples for error responses? It would help developers understand the error format.",
    timestamp: "45 minutes ago",
    reactions: [
      { type: "👍", count: 3, users: ["Sarah Chen", "Mike Wilson", "Jordan Kim"] }
    ]
  },
  {
    id: "3",
    author: "Jordan Kim",
    avatar: "JK",
    content: "The user management endpoints are well documented. Maybe add a note about pagination for the list users endpoint?",
    timestamp: "20 minutes ago", 
    reactions: []
  }
];

export const CommentsPanel = ({ isOpen, onClose }: CommentsPanelProps) => {
  const [comments, setComments] = useState<Comment[]>(demoComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      avatar: "Y",
      content: newComment,
      timestamp: "now",
      reactions: []
    };

    setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: Date.now().toString(),
      author: "You", 
      avatar: "Y",
      content: replyContent,
      timestamp: "now",
      reactions: []
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId
        ? { ...comment, replies: [...(comment.replies || []), reply] }
        : comment
    ));

    setReplyContent("");
    setReplyingTo(null);
  };

  const toggleReaction = (commentId: string, reactionType: string) => {
    // Demo reaction toggle - in real app would sync with backend
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const existingReaction = comment.reactions.find(r => r.type === reactionType);
        const hasUserReacted = existingReaction?.users.includes("You");

        if (existingReaction) {
          if (hasUserReacted) {
            return {
              ...comment,
              reactions: comment.reactions.map(r => 
                r.type === reactionType
                  ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== "You") }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            return {
              ...comment,
              reactions: comment.reactions.map(r =>
                r.type === reactionType
                  ? { ...r, count: r.count + 1, users: [...r.users, "You"] }
                  : r
              )
            };
          }
        } else {
          return {
            ...comment,
            reactions: [...comment.reactions, { type: reactionType, count: 1, users: ["You"] }]
          };
        }
      }
      return comment;
    }));
  };

  if (!isOpen) return null;

  return (
    <Card className="w-80 h-full border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Comments</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
            {comments.length}
          </Badge>
          <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
            DEMO
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-secondary">
                  <span className="text-xs font-medium text-secondary-foreground">
                    {comment.avatar}
                  </span>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                  
                  {/* Reactions */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {comment.reactions.map((reaction, idx) => (
                        <Button
                          key={idx}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 hover:bg-muted"
                          onClick={() => toggleReaction(comment.id, reaction.type)}
                        >
                          <span className="text-xs">{reaction.type}</span>
                          <span className="text-xs ml-1">{reaction.count}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 hover:bg-muted"
                        onClick={() => toggleReaction(comment.id, "👍")}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 hover:bg-muted"
                        onClick={() => toggleReaction(comment.id, "❤️")}
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 hover:bg-muted text-xs"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="flex gap-2 mt-2">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="text-sm min-h-[60px]"
                      />
                      <div className="flex flex-col gap-1">
                        <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 space-y-2 border-l-2 border-border pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <Avatar className="h-6 w-6 bg-secondary">
                            <span className="text-xs font-medium text-secondary-foreground">
                              {reply.avatar}
                            </span>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs text-foreground">{reply.author}</span>
                              <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                            </div>
                            <p className="text-sm text-foreground mt-1">{reply.content}</p>
                            {reply.reactions.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {reply.reactions.map((reaction, idx) => (
                                  <span key={idx} className="text-xs bg-muted px-1 rounded">
                                    {reaction.type} {reaction.count}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add Comment */}
      <div className="p-4 border-t border-border space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment about this documentation..."
          className="text-sm min-h-[80px]"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Demo comments - Not synced
          </p>
          <Button size="sm" onClick={handleAddComment}>
            Comment
          </Button>
        </div>
      </div>
    </Card>
  );
};