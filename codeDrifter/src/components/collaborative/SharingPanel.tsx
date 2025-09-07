import { useState } from "react";
import { Share2, UserPlus, Crown, Eye, Edit, Trash, Copy, Link, X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'active' | 'invited' | 'offline';
}

interface SharingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoUsers: SharedUser[] = [
  {
    id: "1",
    name: "You (Owner)",
    email: "you@company.com", 
    avatar: "Y",
    role: "owner",
    status: "active"
  },
  {
    id: "2", 
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    avatar: "SC",
    role: "editor", 
    status: "active"
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@company.com",
    avatar: "MW", 
    role: "editor",
    status: "offline"
  },
  {
    id: "4",
    name: "Alex Rivera", 
    email: "alex.rivera@company.com",
    avatar: "AR",
    role: "viewer",
    status: "active"
  },
  {
    id: "5",
    name: "Jordan Kim",
    email: "jordan.kim@company.com", 
    avatar: "JK",
    role: "viewer",
    status: "invited"
  }
];

export const SharingPanel = ({ isOpen, onClose }: SharingPanelProps) => {
  const [users, setUsers] = useState<SharedUser[]>(demoUsers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("viewer");
  const [shareLink, setShareLink] = useState("https://docs.company.com/api-docs/abc123");

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return;

    const newUser: SharedUser = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      avatar: inviteEmail[0].toUpperCase(),
      role: inviteRole,
      status: "invited"
    };

    setUsers(prev => [...prev, newUser]);
    setInviteEmail("");
    
    toast({
      title: "Invitation sent",
      description: `Demo invitation sent to ${inviteEmail}`,
    });
  };

  const handleRoleChange = (userId: string, newRole: "editor" | "viewer") => {
    setUsers(prev => prev.map(user => 
      user.id === userId && user.role !== "owner"
        ? { ...user, role: newRole }
        : user
    ));
    
    toast({
      title: "Role updated",
      description: "Demo role change applied",
    });
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId && user.role !== "owner"));
    
    toast({
      title: "User removed", 
      description: "Demo user removed from document",
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-3 w-3" />;
      case 'editor': return <Edit className="h-3 w-3" />;
      case 'viewer': return <Eye className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'offline': return 'bg-gray-400'; 
      case 'invited': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="w-96 h-full border-l border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Share Document</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
            DEMO
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Share Link */}
      <div className="p-4 border-b border-border space-y-3">
        <h4 className="font-medium text-sm text-foreground">Share Link</h4>
        <div className="flex gap-2">
          <Input
            value={shareLink}
            readOnly
            className="text-sm bg-muted"
          />
          <Button variant="outline" size="sm" onClick={copyShareLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Anyone with this link can view the document
        </p>
      </div>

      {/* Invite Users */}
      <div className="p-4 border-b border-border space-y-3">
        <h4 className="font-medium text-sm text-foreground">Invite People</h4>
        <div className="flex gap-2">
          <Input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address"
            className="text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleInviteUser()}
          />
          <Select value={inviteRole} onValueChange={(value: "editor" | "viewer") => setInviteRole(value)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={handleInviteUser} className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Send Invite
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo invites - No actual emails sent
        </p>
      </div>

      {/* Current Users */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 pb-2">
          <h4 className="font-medium text-sm text-foreground">People with access</h4>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="relative">
                  <Avatar className="h-8 w-8 bg-secondary">
                    <span className="text-xs font-medium text-secondary-foreground">
                      {user.avatar}
                    </span>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(user.status)} border-2 border-background`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(user.role)}
                      <span className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  {user.status === 'invited' && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Pending
                    </Badge>
                  )}
                </div>

                {user.role !== 'owner' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, "editor")}>
                        <Edit className="h-3 w-3 mr-2" />
                        Make Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, "viewer")}>
                        <Eye className="h-3 w-3 mr-2" />
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="h-3 w-3 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Demo sharing - Changes not persisted
        </p>
      </div>
    </Card>
  );
};