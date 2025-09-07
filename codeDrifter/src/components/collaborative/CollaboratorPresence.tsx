import { useState, useEffect } from "react";
import { Users, Wifi, WifiOff } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: 'active' | 'idle' | 'offline';
  lastSeen?: string;
  currentSection?: string;
}

interface CollaboratorPresenceProps {
  className?: string;
}

const demoCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "SC", 
    color: "#3B82F6",
    status: "active",
    currentSection: "Authentication"
  },
  {
    id: "2",
    name: "Mike Wilson",
    avatar: "MW",
    color: "#10B981", 
    status: "active",
    currentSection: "User Management"
  },
  {
    id: "3",
    name: "Alex Rivera",
    avatar: "AR",
    color: "#F59E0B",
    status: "idle",
    lastSeen: "2 min ago"
  },
  {
    id: "4", 
    name: "Jordan Kim",
    avatar: "JK",
    color: "#EF4444",
    status: "offline",
    lastSeen: "1 hour ago"
  }
];

export const CollaboratorPresence = ({ className }: CollaboratorPresenceProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(demoCollaborators);
  const [showDetails, setShowDetails] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(collab => {
        // Randomly update status for demo
        if (Math.random() < 0.1) {
          const statuses = ['active', 'idle', 'offline'] as const;
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return {
            ...collab,
            status: newStatus,
            lastSeen: newStatus !== 'active' ? 'just now' : undefined
          };
        }
        return collab;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activeCount = collaborators.filter(c => c.status === 'active').length;
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Wifi className="h-3 w-3 text-green-500" />;
      case 'idle': return <Wifi className="h-3 w-3 text-yellow-500" />;
      case 'offline': return <WifiOff className="h-3 w-3 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500';
      case 'idle': return 'border-yellow-500'; 
      case 'offline': return 'border-gray-400';
      default: return 'border-gray-400';
    }
  };

  return (
    <Card className={`bg-card border-border p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Live Collaborators</span>
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 text-xs">
            {activeCount} active
          </Badge>
          <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
            DEMO
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Avatar Stack */}
          <div className="flex -space-x-2">
            {collaborators.slice(0, 3).map((collaborator) => (
              <Avatar 
                key={collaborator.id} 
                className={`h-6 w-6 border-2 ${getStatusColor(collaborator.status)}`}
                style={{ backgroundColor: collaborator.color }}
              >
                <span className="text-xs font-medium text-white">
                  {collaborator.avatar}
                </span>
              </Avatar>
            ))}
            {collaborators.length > 3 && (
              <div className="h-6 w-6 bg-muted border-2 border-border rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  +{collaborators.length - 3}
                </span>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-6 px-2 hover:bg-muted"
          >
            {showDetails ? 'Hide' : 'Details'}
          </Button>
        </div>
      </div>

      {/* Detailed View */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center gap-3">
              <Avatar 
                className={`h-6 w-6 border-2 ${getStatusColor(collaborator.status)}`}
                style={{ backgroundColor: collaborator.color }}
              >
                <span className="text-xs font-medium text-white">
                  {collaborator.avatar}
                </span>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {collaborator.name}
                  </span>
                  {getStatusIcon(collaborator.status)}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {collaborator.status === 'active' && collaborator.currentSection && (
                    <span>Editing: {collaborator.currentSection}</span>
                  )}
                  {collaborator.status !== 'active' && collaborator.lastSeen && (
                    <span>Last seen: {collaborator.lastSeen}</span>
                  )}
                  {collaborator.status === 'active' && !collaborator.currentSection && (
                    <span>Viewing document</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Demo presence - Simulated real-time updates
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};