import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  jobId: string | null;
}

export default function ExportButton({ jobId }: ExportButtonProps) {
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would trigger the download
      const response = await fetch(`/api/export/job/${jobId}/shortlisted`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'shortlisted-candidates.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: "Export successful",
          description: "Shortlisted candidates have been exported.",
        });
      } else {
        throw new Error("Export failed");
      }
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

  // Mock shortlisted count for demo
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
