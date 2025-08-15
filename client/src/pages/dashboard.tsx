import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import SummaryCards from "@/components/summary-cards";
import PieChartCard from "@/components/pie-chart-card";
import CandidateTable from "@/components/candidate-table";
import JobPanel from "@/components/job-panel";
import ExportButton from "@/components/export-button";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  // Fetch user stats
  const { data: statsData } = useQuery({
    queryKey: ["/api/jobs/stats"],
    enabled: !!localStorage.getItem("token"),
  });

  // Mock recent job ID (in real app, this would come from API)
  useEffect(() => {
    // For demo purposes, set a mock job ID
    setCurrentJobId("sample-job-id");
  }, []);

  const stats = statsData?.stats || {
    tokensUsed: 0,
    cost: "0",
    remainingBalance: 50,
    totalCandidates: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards Row */}
        <SummaryCards stats={stats} />

        {/* Export Button Row */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Job Analysis Results</h2>
          <ExportButton jobId={currentJobId} />
        </div>

        {/* Analytics Row - Side by side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart Card */}
          <div className="lg:col-span-1">
            <PieChartCard />
          </div>
          
          {/* Candidate Table */}
          <div className="lg:col-span-2">
            <CandidateTable jobId={currentJobId} />
          </div>
        </div>

        {/* Job Description Panel */}
        <JobPanel jobId={currentJobId} />
      </div>
    </div>
  );
}
