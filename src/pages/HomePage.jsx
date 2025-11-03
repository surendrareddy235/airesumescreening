import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react"; // useEffect is needed for GlobalStyles

// Mock Button component
const Button = ({ children, onClick, disabled, className, 'data-testid': dataTestId }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    data-testid={dataTestId}
  >
    {children}
  </button>
);

// Mock useToast hook
const useToast = () => ({
  toast: (options) => {
    console.log("Toast:", options.title, options.description, options.variant);
    // In a real app, this would show a notification.
    // For this mock, we'll alert based on the variant for visibility.
    if (options.variant === "destructive") {
      alert(`[ERROR] ${options.title}: ${options.description}`);
    } else {
      alert(`[SUCCESS] ${options.title}: ${options.description}`);
    }
  },
});

// --- Start of Global Styles for Mock UI Classes ---

/**
 * Injects necessary CSS to mock Tailwind utility classes and Font Awesome icons 
 * for a good visual result in a single file React environment.
 */
function GlobalStyles() {
  const css = `
    /* Basic Setup */
    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
    
    /* Mock Colors/Classes (Approximations) */
    .min-h-screen { min-height: 100vh; }
    .bg-slate-100 { background-color: #f1f5f9; }
    .bg-white { background-color: #ffffff; }
    .text-slate-900 { color: #0f172a; }
    .text-slate-800 { color: #1e293b; }
    .text-slate-600 { color: #475569; }
    .text-slate-500 { color: #64748b; }
    .border-slate-200 { border-color: #e2e8f0; }
    .bg-slate-50 { background-color: #f8fafc; }
    .hover\\:bg-slate-50:hover { background-color: #f8fafc; }
    .hover\\:bg-slate-100:hover { background-color: #f1f5f9; }
    
    /* Primary (Blue) */
    .bg-primary-100 { background-color: #dbeafe; } /* Blue-100 */
    .text-primary-800 { color: #1e40af; } /* Blue-800 */
    .text-primary-600 { color: #2563eb; } /* Blue-600 */
    
    /* Success (Green) */
    .bg-success-50 { background-color: #f0fdf4; } /* Green-50 */
    .bg-success-100 { background-color: #dcfce7; } /* Green-100 */
    .text-success-800 { color: #166534; } /* Green-800 */
    .bg-success-600 { background-color: #16a34a; } /* Green-600 */
    .hover\\:bg-success-700:hover { background-color: #15803d; } /* Green-700 */
    .focus\\:ring-success-500:focus { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #22c55e; } /* Green-500 ring */
    .border-success-500 { border-color: #22c55e; } /* Green-500 */
    .text-success-600 { color: #16a34a; } /* Green-600 */

    /* Warning/Yellow */
    .bg-yellow-100 { background-color: #fef9c3; } /* Yellow-100 */
    .text-yellow-600 { color: #eab308; } /* Yellow-600 */

    /* Danger/Red */
    .bg-red-100 { background-color: #fee2e2; } /* Red-100 */
    .text-red-800 { color: #991b1b; } /* Red-800 */
    .text-red-600 { color: #dc2626; } /* Red-600 */
    
    /* Purple */
    .bg-purple-100 { background-color: #ede9fe; } /* Purple-100 */
    .text-purple-600 { color: #7c3aed; } /* Purple-600 */

    /* Other Styles */
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-md { border-radius: 0.375rem; }
    .rounded-full { border-radius: 9999px; }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
    .hover\\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); }
    .transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .transition-shadow { transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .border { border-width: 1px; border-style: solid; }
    .border-l-4 { border-left-width: 4px; border-left-style: solid; }
    
    /* Utility Helpers for Flex/Grid/Layout (Simplified) */
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .flex-shrink-0 { flex-shrink: 0; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .grid { display: grid; }
    .gap-6 { gap: 1.5rem; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    @media (min-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { 
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } 
      .lg\\:col-span-1 { grid-column: span 1 / span 1; }
      .lg\\:col-span-2 { grid-column: span 2 / span 2; }
    }
    
    /* Font Sizing/Weight/Padding/Margin (Simplified) */
    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .p-8 { padding: 2rem; }
    .p-6 { padding: 1.5rem; }
    /* ... and so on for all used classes (p-4, py-3, mb-8, mt-1, ml-4, mr-2, etc.) */
    
    /* For demonstration, let's include all common ones used: */
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .px-2.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
    .py-0.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mt-1 { margin-top: 0.25rem; }
    .ml-4 { margin-left: 1rem; }
    .mr-2 { margin-right: 0.5rem; }
    .mr-1 { margin-right: 0.25rem; }
    .leading-relaxed { line-height: 1.625; }
    .whitespace-pre-line { white-space: pre-line; }
    .whitespace-nowrap { white-space: nowrap; }
    .tracking-wider { letter-spacing: 0.05em; }
    .uppercase { text-transform: uppercase; }
    .text-left { text-align: left; }
    .overflow-hidden { overflow: hidden; }
    .overflow-x-auto { overflow-x: auto; }
    .divide-y > :not([hidden]) ~ :not([hidden]) { border-top-width: 1px; }
    .min-w-full { min-width: 100%; }
    .inline-flex { display: inline-flex; }

    /* Mock Font Awesome (Icons) - Using a simple fallback or Unicode for quick demo */
    /* This requires a real Font Awesome library to be fully functional, 
       but we can use a basic 'i' tag with a fallback font family for the layout. */
    .fas:before { font-style: normal; font-weight: 900; content: "•"; }
    .fa-check:before { content: "✔"; }
    .fa-times:before { content: "✖"; }
    .fa-clock:before { content: "⏳"; }
    .fa-spinner:before { content: "⟳"; } /* Simple spinning mock */
    .fa-microchip:before { content: "칩"; }
    .fa-dollar-sign:before { content: "$"; }
    .fa-wallet:before { content: "💳"; }
    .fa-users:before { content: "👥"; }
    .fa-briefcase:before { content: "💼"; }
    .fa-download:before { content: "⬇"; }

    /* Button Focus Ring Mock */
    button:focus:not(:focus-visible) { outline: none; }
    button:focus-visible { outline: 2px solid; outline-offset: 2px; }
    .focus\\:ring-success-500:focus-visible { outline-color: #22c55e; }
    
    /* Table hover styles */
    .hover\\:bg-slate-50:hover { background-color: #f8fafc; }
    
    /* Simple spin animation for mock spinner */
    .fa-spin { animation: spin 1s linear infinite; }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

  `;

  // Use useEffect to inject the style tag into the document head
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [css]);

  return null; // This component renders nothing itself
}

// --- End of Global Styles for Mock UI Classes ---

// --- Start of Component Definitions (Internal to JobDashboard) ---

/**
 * Renders the candidate data table.
 */
function CandidateTable({ jobId }) {
  // Mock data for demo since we don't have a real job ID yet
  const mockCandidates = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "s.johnson@email.com",
      phone: "+1 (555) 123-4567",
      experienceYears: 8,
      skills: "React, Node.js, Python, AWS",
      matchScore: "94",
      status: "shortlisted",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (555) 987-6543",
      experienceYears: 6,
      skills: "Java, Spring, AWS, Docker",
      matchScore: "89",
      status: "shortlisted",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "e.rodriguez@email.com",
      phone: "+1 (555) 456-7890",
      experienceYears: 4,
      skills: "Vue.js, PHP, MySQL",
      matchScore: "78",
      status: "under_review",
    },
    {
      id: "4",
      name: "David Park",
      email: "d.park@email.com",
      phone: "+1 (555) 789-0123",
      experienceYears: 3,
      skills: "Angular, .NET, SQL Server",
      matchScore: "65",
      status: "under_review",
    },
    {
      id: "5",
      name: "Lisa Thompson",
      email: "l.thompson@email.com",
      phone: "+1 (555) 234-5678",
      experienceYears: 2,
      skills: "HTML, CSS, JavaScript",
      matchScore: "42",
      status: "not_qualified",
    },
  ].sort((a, b) => parseFloat(b.matchScore) - parseFloat(a.matchScore)); // Sort by matchScore descending

  // In a real implementation, this would fetch actual data
  // Since we don't have a global TanStack Query provider, this useQuery hook will not work
  // but we keep the structure for completeness. We'll use the mock data directly.
  const { data: candidatesData } = useQuery({
    queryKey: ["/api/jobs", jobId, "candidates"],
    enabled: !!jobId,
    // We'll mock the data return structure as well
    initialData: { candidates: mockCandidates },
  });

  const candidates = candidatesData?.candidates || mockCandidates;

  const getStatusBadge = (status, matchScore) => {
    const score = parseFloat(matchScore);

    if (status === "shortlisted" || score >= 85) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
          <i className="fas fa-check mr-1"></i>
          Shortlisted
        </span>
      );
    } else if (status === "not_qualified" || score < 50) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <i className="fas fa-times mr-1"></i>
          Not Qualified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          <i className="fas fa-clock mr-1"></i>
          Under Review
        </span>
      );
    }
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 85) return "text-success-600";
    if (numScore >= 70) return "text-primary-600"; // Changed blue-600 to primary-600
    if (numScore >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getRowClasses = (status, matchScore) => {
    const score = parseFloat(matchScore);
    const baseClasses = "hover:bg-slate-50";

    if (status === "shortlisted" || score >= 85) {
      return `${baseClasses} bg-success-50 border-l-4 border-success-500`;
    }
    return baseClasses;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Candidate Rankings</h3>
        <p className="text-sm text-slate-600 mt-1">Sorted by Match Score (Descending)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Exp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Skills</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Match%</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                className={getRowClasses(candidate.status, candidate.matchScore)}
                data-testid={`candidate-row-${candidate.id}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900" data-testid={`candidate-name-${candidate.id}`}>
                    {candidate.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-500" data-testid={`candidate-email-${candidate.id}`}>
                    {candidate.email || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-500" data-testid={`candidate-phone-${candidate.id}`}>
                    {candidate.phone || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900" data-testid={`candidate-experience-${candidate.id}`}>
                    {candidate.experienceYears} yrs
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-500" data-testid={`candidate-skills-${candidate.id}`}>
                    {candidate.skills || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${getScoreColor(candidate.matchScore)}`} data-testid={`candidate-score-${candidate.id}`}>
                    {candidate.matchScore}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" data-testid={`candidate-status-${candidate.id}`}>
                  {getStatusBadge(candidate.status, candidate.matchScore)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing {candidates.length} of {candidates.length} candidates
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100">
              Previous
            </button>
            <button className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------

/**
 * Renders the export button functionality.
 */
function ExportButton({ jobId }) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!jobId) {
      toast({
        title: "Export failed",
        description: "No job selected for export",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);

      // Mock export process for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful download toast
      toast({
        title: "Export successful",
        description: "Shortlisted candidates have been exported (Mock).",
      });

      // NOTE: The actual fetch/download logic is commented out/mocked for this single file environment.
      // ... actual download logic ...
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Mock shortlisted count for demo, based on mock data in CandidateTable
  const shortlistedCount = 2;

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || !jobId}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition-colors"
      data-testid="button-export"
    >
      {isExporting ? (
        <>
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Exporting...
        </>
      ) : (
        <>
          <i className="fas fa-download mr-2"></i>
          Export Shortlisted ({shortlistedCount})
        </>
      )}
    </Button>
  );
}

// -----------------------------------------------------------------

/**
 * Renders the job description panel.
 */
function JobPanel({ jobId }) {
  // Mock job data for demo
  const mockJob = {
    title: "Senior Full Stack Developer",
    description: `We are seeking a highly skilled Senior Full Stack Developer to join our dynamic team. The ideal candidate will have extensive experience in both front-end and back-end development, with a strong passion for creating scalable, efficient, and user-friendly web applications.

Key Responsibilities:
• Design and develop robust web applications using modern frameworks and technologies
• Collaborate with cross-functional teams to define and implement new features
• Optimize applications for maximum speed and scalability
• Ensure code quality through testing and code reviews

Required Skills:
• 5+ years of experience in full-stack development
• Proficiency in React.js, Node.js, and Python
• Experience with database technologies (SQL and NoSQL)
• Knowledge of cloud platforms (AWS, Azure, or GCP)
• Strong understanding of software development lifecycle`,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Job Description</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          <i className="fas fa-briefcase mr-1"></i>
          {mockJob.title}
        </span>
      </div>
      <div className="prose max-w-none">
        <div
          className="text-sm text-slate-600 leading-relaxed whitespace-pre-line"
          data-testid="job-description"
        >
          {mockJob.description}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------

/**
 * Renders the summary statistics cards.
 */
function SummaryCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Tokens Used Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-microchip text-primary-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Tokens Used</p>
            <p className="text-2xl font-bold text-slate-900" data-testid="stat-tokens-used">
              {stats.tokensUsed.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>
      </div>

      {/* Cost Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-dollar-sign text-yellow-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Cost</p>
            <p className="text-2xl font-bold text-slate-900" data-testid="stat-cost">
              ${parseFloat(stats.cost).toFixed(2)}
            </p>
            <p className="text-xs text-slate-500">This month</p>
          </div>
        </div>
      </div>

      {/* Remaining Balance Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-wallet text-success-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Remaining Balance</p>
            <p
              className="text-2xl font-bold text-slate-900"
              data-testid="stat-remaining-balance"
            >
              {stats.remainingBalance} resumes
            </p>
            <p className="text-xs text-success-600">Free trial</p>
          </div>
        </div>
      </div>

      {/* Total Candidates Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Total Candidates</p>
            <p
              className="text-2xl font-bold text-slate-900"
              data-testid="stat-total-candidates"
            >
              {stats.totalCandidates}
            </p>
            <p className="text-xs text-slate-500">Current job</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- End of Component Definitions ---

/**
 * Main dashboard component that orchestrates all sub-components.
 */
export default function JobDashboard() {
  // Mock Job ID for demonstration purposes
  const mockJobId = "job-12345";

  // Mock Stats Data
  const mockStats = {
    tokensUsed: 452890,
    cost: "4.53",
    remainingBalance: 48, // Resumes remaining in trial
    totalCandidates: 5, // Based on mock data in CandidateTable
  };

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-slate-100 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Job Analysis Dashboard</h1>
          <ExportButton jobId={mockJobId} />
        </header>
        <main>
          {/* Summary Statistics */}
          <SummaryCards stats={mockStats} />

          {/* Layout for Job Details and Candidate Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {/* Job Description Panel */}
              <JobPanel jobId={mockJobId} />
            </div>
            <div className="lg:col-span-2">
              {/* Candidate Ranking Table */}
              <CandidateTable jobId={mockJobId} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
