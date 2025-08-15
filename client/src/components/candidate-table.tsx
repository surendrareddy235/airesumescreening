import { useQuery } from "@tanstack/react-query";

interface CandidateTableProps {
  jobId: string | null;
}

interface Candidate {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  experienceYears: number;
  skills: string | null;
  matchScore: string;
  status: string;
}

export default function CandidateTable({ jobId }: CandidateTableProps) {
  // Mock data for demo since we don't have a real job ID yet
  const mockCandidates: Candidate[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "s.johnson@email.com",
      phone: "+1 (555) 123-4567",
      experienceYears: 8,
      skills: "React, Node.js, Python, AWS",
      matchScore: "94",
      status: "shortlisted"
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 (555) 987-6543",
      experienceYears: 6,
      skills: "Java, Spring, AWS, Docker",
      matchScore: "89",
      status: "shortlisted"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "e.rodriguez@email.com",
      phone: "+1 (555) 456-7890",
      experienceYears: 4,
      skills: "Vue.js, PHP, MySQL",
      matchScore: "78",
      status: "under_review"
    },
    {
      id: "4",
      name: "David Park",
      email: "d.park@email.com",
      phone: "+1 (555) 789-0123",
      experienceYears: 3,
      skills: "Angular, .NET, SQL Server",
      matchScore: "65",
      status: "under_review"
    },
    {
      id: "5",
      name: "Lisa Thompson",
      email: "l.thompson@email.com",
      phone: "+1 (555) 234-5678",
      experienceYears: 2,
      skills: "HTML, CSS, JavaScript",
      matchScore: "42",
      status: "not_qualified"
    }
  ];

  // In real implementation, this would fetch actual data
  const { data: candidatesData } = useQuery({
    queryKey: ["/api/jobs", jobId, "candidates"],
    enabled: !!jobId,
  });

  const candidates = candidatesData?.candidates || mockCandidates;

  const getStatusBadge = (status: string, matchScore: string) => {
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

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 85) return "text-success-600";
    if (numScore >= 70) return "text-blue-600";
    if (numScore >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getRowClasses = (status: string, matchScore: string) => {
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
