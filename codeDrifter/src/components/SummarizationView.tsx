import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  FileText, 
  Copy, 
  TrendingUp, 
  Clock, 
  Database,
  Shield,
  Shuffle,
  Trash2,
  Loader2,
  Upload,
  Github,
  FolderOpen,
  Code,
  Link
} from "lucide-react";

interface SampleDocument {
  id: string;
  title: string;
  pages: number;
  content: string;
}

interface SummaryResult {
  summary: string;
  compressionRatio: number;
  timeSaved: number;
  keyPoints: string[];
  originalLength: number;
  summaryLength: number;
}

const sampleDocuments: SampleDocument[] = [
  {
    id: "api",
    title: "API Documentation",
    pages: 45,
    content: `# Authentication API Documentation

## Overview
Our authentication system provides secure user access control through JWT tokens and OAuth integration. The API supports multiple authentication methods including email/password, social login (Google, GitHub, Apple), and two-factor authentication.

## Endpoints

### POST /auth/login
Authenticates a user with email and password credentials.

**Request Body:**
- email (string, required): User's email address
- password (string, required): User's password (minimum 12 characters)
- remember (boolean, optional): Keep user logged in for extended period

**Response:**
- access_token (string): JWT access token (expires in 15 minutes)
- refresh_token (string): Refresh token (expires in 7 days)
- user (object): User profile information

### POST /auth/register
Creates a new user account with email verification.

**Request Body:**
- email (string, required): Valid email address
- password (string, required): Strong password meeting security requirements
- firstName (string, required): User's first name
- lastName (string, required): User's last name

**Response:**
- message (string): Confirmation message
- verification_email_sent (boolean): Email verification status

### POST /auth/refresh
Refreshes an expired access token using a valid refresh token.

**Headers:**
- Authorization: Bearer {refresh_token}

**Response:**
- access_token (string): New JWT access token
- expires_in (number): Token expiration time in seconds

## OAuth Integration

### Google OAuth
Configure Google OAuth in your application settings:
1. Create OAuth 2.0 credentials in Google Cloud Console
2. Set authorized redirect URIs
3. Configure scopes: email, profile, openid

### GitHub OAuth
GitHub integration requires:
- Client ID and Client Secret from GitHub Developer Settings
- Webhook configuration for real-time updates
- Proper scope permissions for user data access

## Security Features

### JWT Token Structure
Our JWT tokens contain:
- User ID and email
- Role and permission claims
- Expiration timestamp
- Security hash for validation

### Rate Limiting
API endpoints are protected with rate limiting:
- Login attempts: 5 per minute per IP
- Registration: 3 per minute per IP
- Password reset: 2 per hour per email

### Password Requirements
Strong password policy enforced:
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Cannot contain user's name or email

## Error Handling
Standard HTTP status codes are used:
- 200: Success
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid credentials)
- 403: Forbidden (insufficient permissions)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Best Practices
1. Always use HTTPS in production
2. Store JWT tokens securely (httpOnly cookies recommended)
3. Implement proper logout functionality
4. Regular token rotation
5. Monitor for suspicious authentication patterns`
  },
  {
    id: "database",
    title: "Database Schema Guide",
    pages: 32,
    content: `# Database Schema Documentation

## Overview
This document outlines the complete database schema for our application, including table structures, relationships, indexes, and migration procedures.

## Core Tables

### Users Table
Primary table for user account information.

**Columns:**
- id (UUID, Primary Key): Unique user identifier
- email (VARCHAR(255), Unique, NOT NULL): User's email address
- password_hash (VARCHAR(255), NOT NULL): Bcrypt hashed password
- first_name (VARCHAR(100), NOT NULL): User's first name
- last_name (VARCHAR(100), NOT NULL): User's last name
- created_at (TIMESTAMP, DEFAULT NOW()): Account creation date
- updated_at (TIMESTAMP, DEFAULT NOW()): Last profile update
- email_verified (BOOLEAN, DEFAULT FALSE): Email verification status
- last_login (TIMESTAMP): Last successful login
- is_active (BOOLEAN, DEFAULT TRUE): Account status

**Indexes:**
- idx_users_email: Unique index on email column
- idx_users_created_at: Index for date-based queries
- idx_users_last_login: Index for activity tracking

### User_Profiles Table
Extended user information and preferences.

**Columns:**
- user_id (UUID, Foreign Key): References users.id
- avatar_url (VARCHAR(500)): Profile picture URL
- bio (TEXT): User biography
- timezone (VARCHAR(50)): User's timezone
- language_preference (VARCHAR(10), DEFAULT 'en'): UI language
- notification_settings (JSONB): Notification preferences
- theme_preference (VARCHAR(20), DEFAULT 'light'): UI theme

### Sessions Table
Active user sessions for security tracking.

**Columns:**
- id (UUID, Primary Key): Session identifier
- user_id (UUID, Foreign Key): References users.id
- refresh_token_hash (VARCHAR(255)): Hashed refresh token
- ip_address (INET): Client IP address
- user_agent (TEXT): Browser/client information
- created_at (TIMESTAMP): Session start time
- expires_at (TIMESTAMP): Session expiration
- is_active (BOOLEAN, DEFAULT TRUE): Session status

## Relationships

### One-to-One Relationships
- Users ↔ User_Profiles: Each user has one profile
- Users ↔ User_Settings: Each user has one settings record

### One-to-Many Relationships
- Users → Sessions: One user can have multiple active sessions
- Users → Audit_Logs: One user can have many audit entries

## Data Types and Constraints

### UUID Usage
All primary keys use UUID v4 for:
- Better security (non-sequential)
- Distributed system compatibility
- Reduced collision probability

### JSON/JSONB Columns
Used for flexible schema data:
- notification_settings: Email, SMS, push preferences
- metadata: Custom fields and temporary data
- audit_data: Change tracking information

## Security Considerations

### Password Security
- All passwords stored as bcrypt hashes (cost factor 12)
- Password history tracking prevents reuse
- Regular password strength auditing

### Data Encryption
- Sensitive PII encrypted at rest
- Database connection uses TLS 1.3
- Backup encryption with rotating keys

### Access Control
- Row-level security policies implemented
- API access through service accounts only
- Regular permission audits

## Performance Optimization

### Indexing Strategy
- Composite indexes for common query patterns
- Partial indexes for conditional queries
- Regular index usage analysis

### Query Optimization
- Prepared statements for security and performance
- Connection pooling with pgBouncer
- Query plan analysis and optimization

### Caching Layer
- Redis for session storage
- Application-level caching for frequently accessed data
- Cache invalidation strategies

## Backup and Recovery

### Backup Schedule
- Full backups: Daily at 2 AM UTC
- Incremental backups: Every 4 hours
- Point-in-time recovery capability
- Cross-region backup replication

### Disaster Recovery
- Recovery Time Objective (RTO): 1 hour
- Recovery Point Objective (RPO): 15 minutes
- Automated failover procedures
- Regular disaster recovery testing

## Migration Procedures

### Schema Changes
1. Create migration script with rollback plan
2. Test on staging environment
3. Schedule maintenance window
4. Execute with zero-downtime strategy
5. Verify data integrity post-migration

### Data Migration
- Bulk operations during low-traffic periods
- Progress monitoring and rollback capabilities
- Data validation at each step
- Performance impact assessment`
  },
  {
    id: "security",
    title: "Security Guidelines",
    pages: 28,
    content: `# Security Guidelines and Best Practices

## Overview
This document establishes comprehensive security standards for our application development, deployment, and operations. All team members must follow these guidelines to ensure robust security posture.

## Authentication and Authorization

### Multi-Factor Authentication (MFA)
Required for all user accounts and administrative access:
- TOTP (Time-based One-Time Password) using apps like Google Authenticator
- SMS backup for account recovery (with rate limiting)
- Hardware security keys (FIDO2/WebAuthn) for high-privilege accounts

### Password Policy
Enforce strong password requirements:
- Minimum 12 characters length
- Combination of uppercase, lowercase, numbers, and special characters
- No common dictionary words or personal information
- Password history tracking (prevent reuse of last 12 passwords)
- Regular password expiration (90 days for admin accounts)

### Session Management
Secure session handling practices:
- JWT tokens with short expiration times (15 minutes)
- Secure refresh token rotation
- HttpOnly and Secure cookie flags
- CSRF protection with SameSite attribute
- Session invalidation on password change

## Data Protection

### Encryption Standards
- Encryption at rest: AES-256 for all sensitive data
- Encryption in transit: TLS 1.3 for all communications
- Database encryption: Transparent Data Encryption (TDE)
- Application-level encryption for PII fields
- Key management through AWS KMS or similar HSM

### Data Classification
Implement data classification levels:
- Public: Marketing materials, public documentation
- Internal: Employee directories, internal tools
- Confidential: Customer data, financial information
- Restricted: Authentication credentials, encryption keys

### Privacy Compliance
GDPR and CCPA compliance requirements:
- Data minimization principles
- Purpose limitation for data collection
- User consent management
- Right to deletion implementation
- Data processing agreements with third parties
- Regular privacy impact assessments

## Infrastructure Security

### Network Security
- VPC with private subnets for application servers
- Web Application Firewall (WAF) for external traffic
- Network segmentation and microsegmentation
- Intrusion detection and prevention systems
- Regular vulnerability scanning and penetration testing

### Server Hardening
- Minimal OS installation with only required services
- Regular security patching and updates
- Disable unnecessary services and ports
- File integrity monitoring
- Log aggregation and monitoring

### Container Security
For containerized applications:
- Base images from trusted sources only
- Regular image vulnerability scanning
- Non-root container execution
- Resource limits and security contexts
- Network policies for pod-to-pod communication

## Application Security

### Input Validation
Comprehensive input validation strategy:
- Server-side validation for all inputs
- Parameterized queries to prevent SQL injection
- Input sanitization for XSS prevention
- File upload restrictions and scanning
- Rate limiting for API endpoints

### Error Handling
Secure error handling practices:
- Generic error messages for external users
- Detailed logging for internal debugging
- No sensitive information in error responses
- Proper exception handling to prevent information disclosure

### API Security
RESTful API security measures:
- OAuth 2.0 with PKCE for authorization
- API versioning and deprecation policies
- Request/response logging and monitoring
- Rate limiting and throttling
- API key management and rotation

## Incident Response

### Security Incident Classification
- Critical: Data breach, system compromise
- High: Service disruption, privilege escalation
- Medium: Failed security controls, policy violations
- Low: Security awareness issues, minor policy deviations

### Response Procedures
1. Immediate containment and isolation
2. Evidence collection and preservation
3. Impact assessment and stakeholder notification
4. Root cause analysis and remediation
5. Post-incident review and improvement

### Communication Plan
- Internal escalation procedures
- External notification requirements (customers, regulators)
- Media relations and public communications
- Legal and compliance team involvement

## Compliance and Auditing

### Regulatory Compliance
- SOC 2 Type II certification maintenance
- PCI DSS compliance for payment processing
- HIPAA compliance for healthcare data
- ISO 27001 information security management

### Security Auditing
Regular security assessments:
- Quarterly internal security reviews
- Annual third-party penetration testing
- Continuous vulnerability scanning
- Code security reviews for all releases
- Access rights reviews and certification

### Monitoring and Alerting
24/7 security monitoring:
- SIEM implementation with custom rules
- Anomaly detection for user behavior
- Failed authentication monitoring
- Privileged access monitoring
- Data access pattern analysis

## Training and Awareness

### Security Training Program
- New employee security orientation
- Quarterly security awareness updates
- Phishing simulation campaigns
- Incident response training exercises
- Role-specific security training

### Security Culture
- Regular security communication
- Reward system for security reporting
- Security champions program
- Open door policy for security concerns
- Integration of security in development lifecycle`
  }
];

export const SummarizationView = ({ onNavigateToResults, onNavigateToEdit }: { onNavigateToResults?: (result: SummaryResult) => void; onNavigateToEdit?: (documentId: string) => void }) => {
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<SampleDocument | null>(null);
  const [customText, setCustomText] = useState("");
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMethod, setInputMethod] = useState<"upload" | "github" | "local" | "sample">("sample");
  const [githubUrl, setGithubUrl] = useState("");
  const [stats, setStats] = useState({
    summariesCreated: 0,
    avgCompression: 0,
    timeSaved: 0,
    sampleDocs: 3
  });

  const generateSummary = async (text: string) => {
    setIsProcessing(true);
    
    toast({
      title: "🧠 AI Processing Started",
      description: "Analyzing document structure and extracting key insights...",
    });

    // Simulate AI processing
    setTimeout(() => {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = text.split(/\s+/).length;
      const summaryText = sentences.slice(0, Math.min(5, Math.floor(sentences.length * 0.3))).join('. ') + '.';
      
      const result: SummaryResult = {
        summary: summaryText,
        compressionRatio: Math.round((1 - summaryText.length / text.length) * 100),
        timeSaved: Math.round(words / 200 * 60), // Assuming 200 words per minute reading speed
        keyPoints: [
          "Authentication system with JWT and OAuth support",
          "Multi-factor authentication implementation",
          "Password security with bcrypt hashing",
          "Rate limiting and security best practices",
          "API documentation with comprehensive examples"
        ],
        originalLength: text.length,
        summaryLength: summaryText.length
      };

      setSummaryResult(result);
      setStats(prev => ({
        ...prev,
        summariesCreated: prev.summariesCreated + 1,
        avgCompression: Math.round((prev.avgCompression + result.compressionRatio) / 2),
        timeSaved: prev.timeSaved + result.timeSaved
      }));

      setIsProcessing(false);
      
      toast({
        title: "✨ Summary Generated",
        description: `Compressed ${result.compressionRatio}% - saved ${result.timeSaved} minutes of reading time`,
      });

      // Navigate to results page if callback provided
      if (onNavigateToResults) {
        setTimeout(() => {
          onNavigateToResults(result);
        }, 1000);
      }
    }, 3000);
  };

  const handleDocumentSelect = (doc: SampleDocument) => {
    setSelectedDocument(doc);
    setCustomText(doc.content);
    setSummaryResult(null);
  };

  const handleGenerateSummary = () => {
    const text = customText.trim();
    if (text.length < 500) {
      toast({
        title: "Text Too Short",
        description: "Please provide at least 500 characters for optimal summarization",
        variant: "destructive"
      });
      return;
    }
    generateSummary(text);
  };

  const handleRandomDemo = () => {
    const randomDoc = sampleDocuments[Math.floor(Math.random() * sampleDocuments.length)];
    handleDocumentSelect(randomDoc);
    setTimeout(() => {
      generateSummary(randomDoc.content);
    }, 500);
  };

  const handleClearResults = () => {
    setSummaryResult(null);
    setCustomText("");
    setSelectedDocument(null);
    toast({
      title: "Results Cleared",
      description: "Ready for new document summarization",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "📋 Copied to Clipboard",
      description: "Summary copied successfully",
    });
  };

  return (
    <div className="flex-1 bg-background overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI-Powered Summarization</h1>
            <p className="text-muted-foreground mt-1">
              Transform long documentation into concise, actionable summaries
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            TL;DR Generator
          </Badge>
        </div>

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4 animate-scale-in">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
                  <Sparkles className="h-6 w-6 text-primary/60 absolute top-0 right-0 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Processing Document</h3>
                  <p className="text-sm text-muted-foreground">AI is analyzing and generating summary...</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full animate-pulse" style={{width: "60%"}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Summaries Created</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.summariesCreated}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Avg Compression</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.avgCompression}%</p>
            </CardContent>
          </Card>

          <Card className="bg-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Time Saved</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.timeSaved}m</p>
            </CardContent>
          </Card>

          <Card className="bg-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Sample Docs</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.sampleDocs}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Input */}
          <div className="lg:col-span-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Document Input
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose your documentation source and generate AI summaries
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Input Method Selection */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Select Input Method:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      onClick={() => setInputMethod("upload")}
                      variant={inputMethod === "upload" ? "default" : "outline"}
                      className="justify-start"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <Button
                      onClick={() => setInputMethod("github")}
                      variant={inputMethod === "github" ? "default" : "outline"}
                      className="justify-start"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      onClick={() => setInputMethod("local")}
                      variant={inputMethod === "local" ? "default" : "outline"}
                      className="justify-start"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Local IDE
                    </Button>
                    <Button
                      onClick={() => setInputMethod("sample")}
                      variant={inputMethod === "sample" ? "default" : "outline"}
                      className="justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Samples
                    </Button>
                  </div>
                </div>

                {/* Input Method Content */}
                {inputMethod === "upload" && (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4 animate-fade-in">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Upload Files or Folders</h3>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your documentation files here, or click to browse
                      </p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                )}

                {inputMethod === "github" && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="text-sm font-medium text-foreground">GitHub Repository URL</label>
                      <div className="mt-2 flex gap-2">
                        <div className="relative flex-1">
                          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="https://github.com/username/repo"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Link className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {inputMethod === "local" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Connect Local IDE</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Connect your local development environment to sync documentation
                      </p>
                      <Button variant="outline" className="w-full">
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Browse Local Folder
                      </Button>
                    </div>
                  </div>
                )}

                {inputMethod === "sample" && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">Quick Start - Sample Documents:</p>
                      <div className="space-y-2">
                        {sampleDocuments.map((doc) => (
                          <Button
                            key={doc.id}
                            onClick={() => handleDocumentSelect(doc)}
                            variant={selectedDocument?.id === doc.id ? "default" : "outline"}
                            className="w-full justify-start hover-scale"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="flex-1 text-left">{doc.title} - {doc.pages} pages</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Text Area */}
                {(selectedDocument || customText) && (
                  <div className="animate-fade-in">
                    <p className="text-sm font-medium text-foreground mb-2">Document Preview</p>
                    <Textarea
                      placeholder="Document content will appear here..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="min-h-[200px] resize-none"
                      readOnly={!!selectedDocument}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {customText.length} characters
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleGenerateSummary}
                  disabled={isProcessing || customText.length < 500}
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate TL;DR Summary
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Summary Results & Demo Controls */}
          <div className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Summary Results
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generated summaries and key insights
                </p>
              </CardHeader>
              <CardContent>
                {summaryResult ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">TL;DR Summary</h4>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyToClipboard(summaryResult.summary)}
                          className="hover-scale"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {summaryResult.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-primary/5 rounded-lg p-3 hover-scale">
                        <p className="text-xs text-muted-foreground">Compression</p>
                        <p className="text-lg font-bold text-primary">{summaryResult.compressionRatio}%</p>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-3 hover-scale">
                        <p className="text-xs text-muted-foreground">Time Saved</p>
                        <p className="text-lg font-bold text-primary">{summaryResult.timeSaved}m</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Key Points</h4>
                      <ul className="space-y-1">
                        {summaryResult.keyPoints.slice(0, 3).map((point, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => onNavigateToResults?.(summaryResult)}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      View Full Results
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No summaries yet. Choose an input method above to get started!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Demo Controls</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Presentation features
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleRandomDemo} className="w-full justify-start hover-scale">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random Demo
                </Button>
                
                <Button onClick={handleClearResults} variant="outline" className="w-full justify-start hover-scale">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Results
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};