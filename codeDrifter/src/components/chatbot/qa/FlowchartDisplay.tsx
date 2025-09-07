import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import mermaid from "mermaid";

interface FlowchartDisplayProps {
  diagram: string;
  title?: string;
}

export const FlowchartDisplay = ({ diagram, title = "Process Flowchart" }: FlowchartDisplayProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (chartRef.current) {
        try {
          // Initialize mermaid with dark theme
          mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            themeVariables: {
              primaryColor: 'hsl(179, 75%, 65%)',
              primaryTextColor: 'hsl(220, 9%, 95%)',
              primaryBorderColor: 'hsl(179, 75%, 65%)',
              lineColor: 'hsl(179, 75%, 65%)',
              secondaryColor: 'hsl(220, 13%, 15%)',
              tertiaryColor: 'hsl(220, 13%, 11%)',
              background: 'hsl(220, 13%, 11%)',
              mainBkg: 'hsl(220, 13%, 15%)',
              secondBkg: 'hsl(220, 13%, 13%)',
              tertiaryBkg: 'hsl(220, 13%, 18%)'
            }
          });

          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, diagram);
          chartRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Error rendering mermaid diagram:', error);
          chartRef.current.innerHTML = `
            <div class="text-destructive text-sm p-4 text-center">
              <p>Error rendering diagram</p>
              <p class="text-xs text-muted-foreground mt-2">Please check the diagram syntax</p>
            </div>
          `;
        }
      }
    };

    renderChart();
  }, [diagram]);

  return (
    <Card className="mt-2 bg-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={chartRef} 
          className="bg-muted rounded-lg p-4 min-h-[200px] flex items-center justify-center overflow-x-auto"
        />
      </CardContent>
    </Card>
  );
};