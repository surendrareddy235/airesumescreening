import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import { insertJobSchema, type InsertJob } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function UploadJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const form = useForm<InsertJob>({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      title: "",
      jdText: "",
    },
  });

  const onSubmit = async (data: InsertJob) => {
    try {
      setIsLoading(true);
      
      // TODO: Handle file uploads with proper multipart/form-data
      // For now, we'll simulate the process
      const response = await apiRequest("POST", "/api/jobs/upload", data);
      const result = await response.json();

      if (result.ok) {
        toast({
          title: "Job uploaded successfully",
          description: "Processing will begin shortly. You'll be redirected to the dashboard.",
        });
        setTimeout(() => {
          setLocation("/dashboard");
        }, 2000);
      } else {
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800">
              <i className="fas fa-upload text-primary mr-2"></i>
              Upload New Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Senior Full Stack Developer"
                          data-testid="input-job-title"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jdText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Paste your job description here..."
                          className="min-h-[200px]"
                          data-testid="textarea-job-description"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Resume Files
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                    <div className="text-center">
                      <i className="fas fa-file-upload text-4xl text-slate-400 mb-4"></i>
                      <div className="text-sm text-slate-600 mb-4">
                        Drag and drop resume files here, or click to browse
                      </div>
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="max-w-xs"
                        data-testid="input-resume-files"
                      />
                      <div className="text-xs text-slate-500 mt-2">
                        Supported formats: PDF, DOCX (Max 8MB per file)
                      </div>
                    </div>
                  </div>
                  {files && files.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-slate-700 mb-2">
                        Selected files ({files.length}):
                      </div>
                      <div className="space-y-1">
                        {Array.from(files).map((file, index) => (
                          <div key={index} className="text-sm text-slate-600">
                            <i className="fas fa-file mr-2"></i>
                            {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1"
                    data-testid="button-upload-job"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload mr-2"></i>
                        Upload & Process Job
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setLocation("/dashboard")}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
