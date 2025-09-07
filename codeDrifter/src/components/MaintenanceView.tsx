import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Bell, 
  Plus, 
  GitPullRequest, 
  Zap,
  Clock,
  Code,
  FileText
} from "lucide-react";

interface DriftItem {
  id: string;
  component: string;
  priority: "high" | "medium" | "low";
  docPath: string;
  lastDocUpdate: string;
  codeModified: string;
  suggestedChanges: string[];
  affectedFiles: string[];
}

interface RecentUpdate {
  id: string;
  timestamp: string;
  type: "auto-update" | "auto-fix" | "manual-update";
  description: string;
  filesUpdated: number;
  component: string;
}

export const MaintenanceView = () => {
  const { toast } = useToast();
  const [driftItems, setDriftItems] = useState<DriftItem[]>([
    {
      id: "1",
      component: "UserAuthentication.tsx",
      priority: "high",
      docPath: "/docs/auth/user-authentication.md",
      lastDocUpdate: "2024-01-15",
      codeModified: "2024-01-22",
      suggestedChanges: [
        "Update OAuth provider configuration (Google, GitHub, Apple)",
        "Document new password requirements (12+ chars, special symbols)",
        "Add JWT token refresh flow documentation",
        "Update two-factor authentication setup process"
      ],
      affectedFiles: ["LoginForm.tsx", "RegistrationForm.tsx", "UserProfile.tsx", "SecuritySettings.tsx"]
    },
    {
      id: "2", 
      component: "PaymentProcessor.tsx",
      priority: "medium",
      docPath: "/docs/payments/payment-integration.md",
      lastDocUpdate: "2024-01-10",
      codeModified: "2024-01-18",
      suggestedChanges: [
        "Update Stripe API v3 integration steps",
        "Document webhook endpoint security",
        "Add refund process documentation"
      ],
      affectedFiles: ["CheckoutForm.tsx", "PaymentHistory.tsx"]
    }
  ]);

  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([
    {
      id: "1",
      timestamp: "2024-01-22T10:30:00Z",
      type: "auto-update",
      description: "Updated API documentation for new endpoints",
      filesUpdated: 3,
      component: "APIService.tsx"
    },
    {
      id: "2",
      timestamp: "2024-01-22T09:15:00Z", 
      type: "manual-update",
      description: "Fixed typos in user guide sections",
      filesUpdated: 2,
      component: "UserGuide.md"
    }
  ]);

  const [stats, setStats] = useState({
    highPriority: 2,
    mediumPriority: 2,
    lowPriority: 1,
    notifications: 0
  });

  const handleRunScan = () => {
    toast({
      title: "🔍 Drift Scan Initiated",
      description: "Analyzing 47 components for documentation drift...",
    });

    setTimeout(() => {
      toast({
        title: "✅ Scan Complete",
        description: "Found 3 new drift issues across authentication and payment modules",
      });
      setStats(prev => ({ ...prev, notifications: prev.notifications + 3 }));
    }, 2000);
  };

  const handleAddDriftItem = () => {
    const newItem: DriftItem = {
      id: Math.random().toString(),
      component: "FileUploadService.tsx",
      priority: "high",
      docPath: "/docs/uploads/file-handling.md",
      lastDocUpdate: "2024-01-05",
      codeModified: "2024-01-20",
      suggestedChanges: [
        "Update maximum file size limits (now 50MB)",
        "Document new image compression settings",
        "Add virus scanning integration docs"
      ],
      affectedFiles: ["FileUploader.tsx", "ImageOptimizer.tsx"]
    };

    setDriftItems(prev => [...prev, newItem]);
    setStats(prev => ({ ...prev, highPriority: prev.highPriority + 1 }));
    
    toast({
      title: "🆕 New Drift Detected",
      description: "FileUploadService.tsx has outdated documentation",
    });
  };

  const handleSimulatePR = () => {
    toast({
      title: "📋 PR Analysis Complete",
      description: "3 documentation updates needed for authentication refactor",
    });

    setTimeout(() => {
      toast({
        title: "🔔 Dependency Alert",
        description: "UserProfile.tsx changes affect 4 documentation files",
      });
    }, 1500);
  };

  const handleAutoFix = () => {
    toast({
      title: "⚡ Auto-Fix Started",
      description: "Updating 5 documentation files automatically...",
    });

    setTimeout(() => {
      setDriftItems([]);
      setStats({ highPriority: 0, mediumPriority: 0, lowPriority: 0, notifications: 0 });
      
      // Add to recent updates
      const newUpdate: RecentUpdate = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: "auto-fix",
        description: "Auto-fixed all drift issues",
        filesUpdated: 5,
        component: "Multiple components"
      };
      setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
      
      toast({
        title: "✨ Auto-Fix Complete",
        description: "All drift issues resolved! Documentation is now up-to-date.",
      });
    }, 3000);
  };

  const handleAutoUpdate = (itemId: string) => {
    const item = driftItems.find(d => d.id === itemId);
    if (!item) return;

    toast({
      title: "🔄 Auto-Update Started",
      description: `Updating documentation for ${item.component}...`,
    });

    setTimeout(() => {
      // Remove the item from drift list
      setDriftItems(prev => prev.filter(d => d.id !== itemId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        [item.priority + 'Priority']: Math.max(0, prev[item.priority + 'Priority' as keyof typeof prev] - 1)
      }));

      // Add to recent updates
      const newUpdate: RecentUpdate = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: "auto-update",
        description: `Updated ${item.component} documentation`,
        filesUpdated: item.affectedFiles.length,
        component: item.component
      };
      setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);

      toast({
        title: "✅ Auto-Update Complete",
        description: `${item.component} documentation has been updated successfully!`,
      });
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <Clock className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 bg-background overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documentation Maintenance</h1>
            <p className="text-muted-foreground mt-1">
              Detect stale documentation and manage doc drift automatically
            </p>
          </div>
          <Button onClick={handleRunScan} className="bg-primary hover:bg-primary/90">
            <Eye className="h-4 w-4 mr-2" />
            Run Scan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-destructive/20 hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-muted-foreground">High Priority</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.highPriority}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-muted hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Medium Priority</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.mediumPriority}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20 hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Low Priority</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.lowPriority}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-muted hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Notifications</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.notifications}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documentation Drift Detection */}
          <div className="lg:col-span-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Documentation Drift Detection
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Components where documentation may be out of sync with code changes
                </p>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {driftItems.map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-4 space-y-3 animate-fade-in hover-scale">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{item.component}</span>
                        <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                          {getPriorityIcon(item.priority)}
                          <span className="ml-1">{item.priority}</span>
                        </Badge>
                      </div>
                      <Button size="sm" onClick={() => handleAutoUpdate(item.id)} className="bg-primary hover:bg-primary/90 hover-scale">
                        Auto-Update
                      </Button>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Doc:</span> {item.docPath}</p>
                      <p><span className="text-muted-foreground">Last doc update:</span> {item.lastDocUpdate} | <span className="text-muted-foreground">Code modified:</span> {item.codeModified}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Suggested Changes:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.suggestedChanges.map((change, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Affects:</span> {item.affectedFiles.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
                
                {driftItems.length === 0 && (
                  <div className="text-center py-8 animate-fade-in">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-foreground font-medium">All documentation up-to-date!</p>
                    <p className="text-sm text-muted-foreground">No drift detected in your components</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Live Notifications & Demo Actions */}
          <div className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Updates
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest documentation improvements
                </p>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {recentUpdates.map((update) => (
                  <div key={update.id} className="border border-border rounded-lg p-3 space-y-2 animate-fade-in hover-scale">
                    <div className="flex items-center justify-between">
                      <Badge variant={update.type === 'auto-fix' ? 'default' : update.type === 'auto-update' ? 'secondary' : 'outline'} className="text-xs">
                        {update.type === 'auto-fix' && <Zap className="h-3 w-3 mr-1" />}
                        {update.type === 'auto-update' && <FileText className="h-3 w-3 mr-1" />}
                        {update.type === 'manual-update' && <Code className="h-3 w-3 mr-1" />}
                        {update.type.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{update.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{update.component}</span>
                      <span>{update.filesUpdated} files updated</span>
                    </div>
                  </div>
                ))}
                {recentUpdates.length === 0 && (
                  <div className="text-center py-6">
                    <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent updates</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Live Notifications
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time alerts for documentation maintenance
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet. Run a scan or simulate changes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Demo Actions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Interactive presentation controls
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleAddDriftItem} className="w-full justify-start hover-scale">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Drift Item
                </Button>
                
                <Button onClick={handleSimulatePR} variant="outline" className="w-full justify-start hover-scale">
                  <GitPullRequest className="h-4 w-4 mr-2" />
                  Simulate PR Analysis
                </Button>
                
                <Button onClick={handleAutoFix} variant="outline" className="w-full justify-start hover-scale">
                  <Zap className="h-4 w-4 mr-2" />
                  Auto-Fix All
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};