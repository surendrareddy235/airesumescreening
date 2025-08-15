interface JobPanelProps {
  jobId: string | null;
}

export default function JobPanel({ jobId }: JobPanelProps) {
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
• Strong understanding of software development lifecycle`
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
        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line" data-testid="job-description">
          {mockJob.description}
        </div>
      </div>
    </div>
  );
}
