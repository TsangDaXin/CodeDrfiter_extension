import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  GitBranch, 
  Upload, 
  Github, 
  FolderOpen,
  FileText,
  Code,
  Sparkles,
  Download,
  RefreshCw
} from "lucide-react";
import { FileUploadDropzone } from "./visualizations/FileUploadDropzone";
import { GitHubIntegration } from "./visualizations/GitHubIntegration";
import { AnalysisOptions } from "./visualizations/AnalysisOptions";
import { InteractiveDiagram } from "./visualizations/InteractiveDiagram";

interface UploadedFile {
  name: string;
  content: string;
  type: 'file' | 'folder';
  path: string;
}

interface AnalysisConfig {
  scope: 'entire' | 'file' | 'function';
  selectedFiles: string[];
  selectedFunctions: string[];
  visualizationTypes: ('flowchart' | 'api-graph' | 'changelog' | 'architecture')[];
}

export const VisualizationsView = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analyze' | 'visualize'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig>({
    scope: 'entire',
    selectedFiles: [],
    selectedFunctions: [],
    visualizationTypes: []
  });
  const [generatedDiagrams, setGeneratedDiagrams] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    setActiveTab('analyze');
  };

  const handleAnalysisComplete = async (config: AnalysisConfig) => {
    setAnalysisConfig(config);
    setIsGenerating(true);
    setActiveTab('visualize');
    
    // Simulate diagram generation
    setTimeout(() => {
      const mockDiagrams = generateMockDiagrams(config, uploadedFiles);
      setGeneratedDiagrams(mockDiagrams);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockDiagrams = (config: AnalysisConfig, files: UploadedFile[]) => {
    const diagrams = [];
    
    // Generate diagrams for each selected visualization type
    config.visualizationTypes.forEach(visualizationType => {
      switch (visualizationType) {
        case 'flowchart':
          diagrams.push({
            id: 'flow-1',
            title: 'Application Flow Diagram',
            type: 'flowchart',
            code: `flowchart TD
    Start([Start Application]) --> Init[Initialize System]
    Init --> Auth{User Authenticated?}
    Auth -->|No| Login[Show Login Form]
    Auth -->|Yes| Dashboard[Load Dashboard]
    
    Login --> ValidateUser{Validate Credentials}
    ValidateUser -->|Invalid| LoginError[Show Error Message]
    ValidateUser -->|Valid| SetSession[Create User Session]
    LoginError --> Login
    SetSession --> Dashboard
    
    Dashboard --> UserAction{User Action}
    UserAction -->|Create| CreateData[Create New Data]
    UserAction -->|Read| ReadData[Fetch Data]
    UserAction -->|Update| UpdateData[Modify Data]
    UserAction -->|Delete| DeleteData[Remove Data]
    
    CreateData --> Validate{Validate Input}
    Validate -->|Invalid| ShowError[Display Validation Error]
    Validate -->|Valid| SaveData[Save to Database]
    ShowError --> UserAction
    SaveData --> Success[Show Success Message]
    Success --> Dashboard
    
    ReadData --> FetchDB[Query Database]
    FetchDB --> DisplayData[Render Data]
    DisplayData --> Dashboard
    
    UpdateData --> ValidateUpdate{Validate Changes}
    ValidateUpdate -->|Invalid| UpdateError[Show Update Error]
    ValidateUpdate -->|Valid| SaveUpdate[Update Database]
    UpdateError --> UserAction
    SaveUpdate --> UpdateSuccess[Show Update Success]
    UpdateSuccess --> Dashboard
    
    DeleteData --> ConfirmDelete{Confirm Deletion}
    ConfirmDelete -->|Cancel| Dashboard
    ConfirmDelete -->|Confirm| RemoveData[Delete from Database]
    RemoveData --> DeleteSuccess[Show Delete Success]
    DeleteSuccess --> Dashboard`,
            description: 'Complete application flow showing user interactions and system responses'
          });
          break;
        
        case 'api-graph':
          diagrams.push({
            id: 'api-1',
            title: 'API Call Graph',
            type: 'sequenceDiagram',
            code: `sequenceDiagram
    participant Client as Web Client
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant UserAPI as User Service
    participant DataAPI as Data Service
    participant DB as Database
    participant Cache as Redis Cache
    participant Queue as Message Queue
    participant Email as Email Service

    Note over Client,Email: User Registration Flow
    Client->>Gateway: POST /api/register
    Gateway->>Auth: Validate registration data
    Auth->>DB: Check if user exists
    DB-->>Auth: User not found
    Auth->>DB: Create new user
    DB-->>Auth: User created successfully
    Auth->>Queue: Queue welcome email
    Queue->>Email: Send welcome email
    Auth-->>Gateway: Registration successful
    Gateway-->>Client: 201 Created + JWT Token

    Note over Client,Email: User Login Flow  
    Client->>Gateway: POST /api/login
    Gateway->>Auth: Authenticate user
    Auth->>DB: Verify credentials
    DB-->>Auth: Credentials valid
    Auth->>Cache: Store session
    Auth-->>Gateway: Login successful + JWT
    Gateway-->>Client: 200 OK + JWT Token

    Note over Client,Email: Data Operations
    Client->>Gateway: GET /api/data (with JWT)
    Gateway->>Auth: Validate JWT token
    Auth->>Cache: Check token validity
    Cache-->>Auth: Token valid
    Auth-->>Gateway: Token authorized
    Gateway->>DataAPI: Fetch user data
    DataAPI->>Cache: Check cached data
    Cache-->>DataAPI: Cache miss
    DataAPI->>DB: Query user data
    DB-->>DataAPI: Return data
    DataAPI->>Cache: Store in cache
    DataAPI-->>Gateway: Return data
    Gateway-->>Client: 200 OK + Data

    Note over Client,Email: Data Update
    Client->>Gateway: PUT /api/data/:id (with JWT)
    Gateway->>Auth: Validate JWT
    Auth-->>Gateway: Authorized
    Gateway->>DataAPI: Update data request
    DataAPI->>DB: Update record
    DB-->>DataAPI: Update successful
    DataAPI->>Cache: Invalidate cache
    DataAPI->>Queue: Queue update notification
    Queue->>Email: Send update notification
    DataAPI-->>Gateway: Update confirmed
    Gateway-->>Client: 200 OK + Updated data`,
            description: 'API interaction patterns showing authentication, data operations, and service communications'
          });
          break;
        
        case 'changelog':
          diagrams.push({
            id: 'changelog-1',
            title: 'Development Timeline',
            type: 'gitgraph',
            code: `gitgraph
    commit id: "Initial project setup"
    commit id: "Add basic structure"
    commit id: "Setup database schema"
    
    branch feature/authentication
    checkout feature/authentication
    commit id: "Add user model"
    commit id: "Implement JWT auth"
    commit id: "Add login/register endpoints"
    commit id: "Add password hashing"
    
    checkout main
    branch feature/api-endpoints
    checkout feature/api-endpoints
    commit id: "Create CRUD operations"
    commit id: "Add input validation"
    commit id: "Implement error handling"
    
    checkout main
    branch feature/frontend
    checkout feature/frontend
    commit id: "Setup React app"
    commit id: "Add routing"
    commit id: "Create login form"
    commit id: "Add dashboard"
    commit id: "Implement data tables"
    
    checkout main
    merge feature/authentication
    commit id: "Merge authentication system"
    
    merge feature/api-endpoints
    commit id: "Merge API endpoints"
    
    merge feature/frontend
    commit id: "Merge frontend components"
    commit id: "Fix merge conflicts"
    commit id: "Update documentation"
    commit id: "Release v1.0.0" tag: "v1.0.0"
    
    branch hotfix/security-patch
    checkout hotfix/security-patch
    commit id: "Fix auth vulnerability"
    commit id: "Update dependencies"
    
    checkout main
    merge hotfix/security-patch
    commit id: "Security patch v1.0.1" tag: "v1.0.1"
    
    branch feature/notifications
    checkout feature/notifications
    commit id: "Add email service"
    commit id: "Implement push notifications"
    commit id: "Add notification preferences"
    
    checkout main
    branch feature/analytics
    checkout feature/analytics
    commit id: "Add tracking events"
    commit id: "Create analytics dashboard"
    commit id: "Implement reporting"
    
    checkout main
    merge feature/notifications
    commit id: "Add notification system"
    
    merge feature/analytics
    commit id: "Add analytics features"
    commit id: "Performance optimizations"
    commit id: "Release v2.0.0" tag: "v2.0.0"`,
            description: 'Project development timeline showing feature branches, merges, and releases'
          });
          break;
        
        case 'architecture':
          diagrams.push({
            id: 'arch-1',
            title: 'System Architecture Overview',
            type: 'graph',
            code: `graph TB
    subgraph "Client Tier"
        WebApp[Web Application<br/>React + TypeScript]
        MobileApp[Mobile App<br/>React Native]
        AdminPanel[Admin Dashboard<br/>React Admin]
    end
    
    subgraph "CDN & Load Balancing"
        CDN[Content Delivery Network<br/>Static Assets]
        LoadBalancer[Load Balancer<br/>NGINX/HAProxy]
    end
    
    subgraph "API Gateway Layer"
        Gateway[API Gateway<br/>Authentication & Routing]
        RateLimit[Rate Limiting<br/>Request Throttling]
        Monitor[API Monitoring<br/>Logging & Metrics]
    end
    
    subgraph "Microservices"
        AuthService[Authentication Service<br/>JWT + OAuth]
        UserService[User Management<br/>Profile & Preferences]
        DataService[Data Processing<br/>Business Logic]
        NotificationService[Notification Service<br/>Email + Push + SMS]
        AnalyticsService[Analytics Service<br/>Event Tracking]
        FileService[File Management<br/>Upload & Storage]
    end
    
    subgraph "Data Layer"
        PostgresDB[(PostgreSQL<br/>Primary Database)]
        MongoDB[(MongoDB<br/>Document Store)]
        RedisCache[(Redis<br/>Caching Layer)]
        S3Storage[(AWS S3<br/>File Storage)]
    end
    
    subgraph "Message Queue"
        RabbitMQ[RabbitMQ<br/>Async Processing]
        EmailQueue[Email Queue]
        NotificationQueue[Push Notification Queue]
    end
    
    subgraph "External Services"
        EmailProvider[Email Service<br/>SendGrid/SES]
        PushProvider[Push Notifications<br/>Firebase/APNS]
        PaymentGateway[Payment Gateway<br/>Stripe/PayPal]
        Analytics[Analytics Platform<br/>Google Analytics]
    end
    
    subgraph "Infrastructure"
        Docker[Docker Containers]
        Kubernetes[Kubernetes Orchestration]
        Monitoring[Monitoring Stack<br/>Prometheus + Grafana]
    end
    
    %% Client connections
    WebApp --> CDN
    MobileApp --> CDN
    AdminPanel --> CDN
    
    WebApp --> LoadBalancer
    MobileApp --> LoadBalancer
    AdminPanel --> LoadBalancer
    
    %% Load balancer to gateway
    LoadBalancer --> Gateway
    Gateway --> RateLimit
    Gateway --> Monitor
    
    %% Gateway to services
    Gateway --> AuthService
    Gateway --> UserService
    Gateway --> DataService
    Gateway --> NotificationService
    Gateway --> AnalyticsService
    Gateway --> FileService
    
    %% Service to database connections
    AuthService --> PostgresDB
    AuthService --> RedisCache
    
    UserService --> PostgresDB
    UserService --> RedisCache
    
    DataService --> PostgresDB
    DataService --> MongoDB
    DataService --> RedisCache
    
    FileService --> S3Storage
    
    %% Message queue connections
    NotificationService --> RabbitMQ
    RabbitMQ --> EmailQueue
    RabbitMQ --> NotificationQueue
    
    EmailQueue --> EmailProvider
    NotificationQueue --> PushProvider
    
    %% External service connections
    DataService --> PaymentGateway
    AnalyticsService --> Analytics
    
    %% Infrastructure connections
    AuthService -.-> Docker
    UserService -.-> Docker
    DataService -.-> Docker
    NotificationService -.-> Docker
    AnalyticsService -.-> Docker
    FileService -.-> Docker
    
    Docker -.-> Kubernetes
    Kubernetes -.-> Monitoring`,
            description: 'Complete system architecture showing all components, services, and their relationships'
          });
          break;
      }
    });
    
    return diagrams;
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              Code Visualizations
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate interactive diagrams from your codebase - flowcharts, API graphs, and architecture visualizations
            </p>
          </div>
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            <Sparkles className="h-3 w-3 mr-1" />
            Interactive
          </Badge>
        </div>

        {/* Progress Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Source
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center gap-2" disabled={uploadedFiles.length === 0}>
              <Code className="h-4 w-4" />
              Configure Analysis
            </TabsTrigger>
            <TabsTrigger value="visualize" className="flex items-center gap-2" disabled={generatedDiagrams.length === 0 && !isGenerating}>
              <BarChart3 className="h-4 w-4" />
              View Diagrams
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="feature-card glow-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Local Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadDropzone onFilesUploaded={handleFilesUploaded} />
                </CardContent>
              </Card>

              <Card className="feature-card glow-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Github className="h-5 w-5 text-primary" />
                    GitHub Repository
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GitHubIntegration onFilesUploaded={handleFilesUploaded} />
                </CardContent>
              </Card>

              <Card className="feature-card glow-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    IDE Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Connect your IDE to automatically sync project files and generate real-time visualizations.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      <Code className="h-4 w-4 mr-2" />
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Uploaded Files ({uploadedFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="p-2 bg-muted rounded-lg flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analyze" className="mt-6">
            <AnalysisOptions 
              files={uploadedFiles}
              config={analysisConfig}
              onConfigChange={setAnalysisConfig}
              onAnalyze={handleAnalysisComplete}
            />
          </TabsContent>

          {/* Visualization Tab */}
          <TabsContent value="visualize" className="mt-6">
            {isGenerating ? (
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <h3 className="text-lg font-medium">Generating Visualizations...</h3>
                  <p className="text-muted-foreground text-center">
                    Analyzing your code and creating interactive diagrams
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {generatedDiagrams.map((diagram) => (
                  <InteractiveDiagram 
                    key={diagram.id}
                    diagram={diagram}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};