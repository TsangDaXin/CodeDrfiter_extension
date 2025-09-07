import { useState } from "react";
import { WelcomeView } from "./WelcomeView";
import { HistoryView } from "./HistoryView";
import { ExploreView } from "./ExploreView";
import { DocumentationEditor } from "./DocumentationEditor";
import { FixTheDocsLanding } from "./FixTheDocsLanding";
import { MaintenanceView } from "./MaintenanceView";
import { SummarizationView } from "./SummarizationView";
import { SummaryResultsPage } from "./SummaryResultsPage";
import { VisualizationsView } from "./VisualizationsView";

interface MainWorkspaceProps {
  selectedTab: string;
}

export const MainWorkspace = ({ selectedTab }: MainWorkspaceProps) => {
  const [currentView, setCurrentView] = useState<"main" | "editor" | "summary-results">("main");
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [summaryResult, setSummaryResult] = useState<any>(null);

  const handleViewDocument = (documentId: string) => {
    setCurrentDocumentId(documentId);
    setCurrentView("editor");
  };

  const handleBackToHistory = () => {
    setCurrentView("main");
    setCurrentDocumentId(null);
    setSummaryResult(null);
  };

  const handleNavigateToSummaryResults = (result: any) => {
    setSummaryResult(result);
    setCurrentView("summary-results");
  };

  const handleEditSummary = () => {
    // Navigate to documentation editor with a summary document ID
    const summaryDocumentId = "summary-" + Date.now();
    setCurrentDocumentId(summaryDocumentId);
    setCurrentView("editor");
  };

  if (currentView === "editor" && currentDocumentId) {
    return (
      <DocumentationEditor 
        documentId={currentDocumentId}
        onBack={handleBackToHistory}
      />
    );
  }

  if (currentView === "summary-results" && summaryResult) {
    return (
      <SummaryResultsPage 
        result={summaryResult}
        onBack={handleBackToHistory}
        onEdit={handleEditSummary}
      />
    );
  }

  const renderContent = () => {
    switch (selectedTab) {
      case "history":
        return <HistoryView onViewDocument={handleViewDocument} />;
      case "explore":
        return <ExploreView />;
      case "maintenance":
        return <MaintenanceView />;
      case "summarization":
        return (
          <SummarizationView 
            onNavigateToResults={handleNavigateToSummaryResults}
            onNavigateToEdit={handleEditSummary}
          />
        );
      case "visualizations":
        return <VisualizationsView />;
      case "home":
        return <FixTheDocsLanding />;
      default:
        return <WelcomeView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background overflow-hidden">
      {renderContent()}
    </div>
  );
};