import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import BaseResumeTab from './BaseResumeTab';
import JobMatchesTab from './JobMatchesTab';
import ApplicationHubTab from './ApplicationHubTab';

export default function JobSearchHubPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  // Data flowing between tabs
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [hubLoading, setHubLoading] = useState(false);

  // Called when BaseResumeTab finishes the API call
  const handleMatchResults = ({ jobs, resumeSkills: skills, file }) => {
    setMatchedJobs(jobs);
    setResumeSkills(skills);
    setUploadedFile(file);
  };

  // Called when user selects jobs and clicks "Generate Tailored Resumes"
  const handleGenerate = (selectedJobs) => {
    setHubLoading(true);
    setTab(2);
    const today = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const newApps = selectedJobs.map((job) => ({
      id: `app-${job.id}`,
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      applyUrl: job.applyUrl || '',
      status: 'Generated',
      generatedOn: today,
    }));
    // Simulate resume generation delay
    setTimeout(() => {
      setApplications((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        return [...prev, ...newApps.filter((a) => !existingIds.has(a.id))];
      });
      setHubLoading(false);
    }, 1500);
  };

  const handleAddToApplications = (selectedJobs) => {
    const today = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const newApps = selectedJobs.map((job) => ({
      id: `app-${job.id}`,
      jobId: job.id,
      title: job.title,
      company: job.company || 'Confidential',
      location: job.location || 'Remote',
      applyUrl: job.applyUrl || job.apply_url || '',
      status: 'Generated',
      generatedOn: today,
    }));
    setApplications((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      return [...prev, ...newApps.filter((a) => !existingIds.has(a.id))];
    });
    setTab(2); // Go directly to Application Hub tab
  };

  const handleStatusChange = (id, status) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        bgcolor: 'background.default',
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/jobs')}
            sx={{ textTransform: 'none' }}
          >
            Dashboard
          </Button>
          <Typography
            variant="h5"
            component="h1"
            fontWeight={700}
            sx={{ color: 'primary.main', m: 0 }}
          >
            AI Job Search Hub
          </Typography>
        </Stack>

        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="fullWidth"
            >
              <Tab label="1. Base Resume" />
              <Tab label="2. Job Matches" />
              <Tab
                label={
                  <Badge
                    color="primary"
                    badgeContent={applications.length}
                    invisible={applications.length === 0}
                  >
                    <Box component="span" sx={{ pr: 1 }}>
                      3. Application Hub
                    </Box>
                  </Badge>
                }
              />
            </Tabs>

          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            {tab === 0 && (
              <BaseResumeTab
                onNext={() => setTab(1)}
                onMatchResults={handleMatchResults}
                onAddToApplications={handleAddToApplications}
              />
            )}
            {tab === 1 && (
              <JobMatchesTab
                jobs={matchedJobs}
                resumeSkills={resumeSkills}
                onGenerate={handleGenerate}
              />
            )}
            {tab === 2 && (
              <ApplicationHubTab
                loading={hubLoading}
                applications={applications}
                onStatusChange={handleStatusChange}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
