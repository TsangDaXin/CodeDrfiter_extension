import { FileText, Eye, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const quickActions = [
  { id: 'generate-starter', icon: FileText, label: 'Generate Starter Doc', description: 'Create templates' },
  { id: 'summarize', icon: Eye, label: 'Summarize Text', description: 'Get TL;DR' },
  { id: 'show-diagram', icon: BarChart3, label: 'Show Flowchart', description: 'Visual diagrams' }
];

export const QuickActions = ({ onAction }: QuickActionsProps) => {
  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
      <div className="space-y-2">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            onClick={() => onAction(action.id)}
            className="w-full justify-start gap-3 h-auto p-3 hover:bg-muted"
          >
            <action.icon className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-medium">{action.label}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};