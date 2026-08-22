import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Slide from '@mui/material/Slide';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

import { getJobDetail } from './jobSearchApi';

function scoreColor(score) {
  if (score >= 85) return 'success';
  if (score >= 70) return 'primary';
  return 'warning';
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d ago';
  if (diffDays < 30) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

const getSafeUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

export default function JobMatchesTab({ jobs = [], onGenerate, resumeSkills = [] }) {
  const [selected, setSelected] = useState(new Set());
  const [generating, setGenerating] = useState(false);

  // Job details dialog state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOpenDetails = async (jobId) => {
    setDetailsOpen(true);
    setLoadingDetails(true);
    setDetailsError(null);
    setSelectedJobDetails(null);
    try {
      const details = await getJobDetail(jobId);
      setSelectedJobDetails(details);
    } catch (err) {
      setDetailsError(err.message || 'Failed to load job details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleGenerate = () => {
    setGenerating(true);
    const chosen = jobs.filter((j) => selected.has(j.id));
    // Simulate tailoring work before moving on
    setTimeout(() => {
      setGenerating(false);
      onGenerate(chosen);
    }, 1800);
  };

  const selectedCount = selected.size;

  return (
    <Box sx={{ pb: selectedCount > 0 ? 12 : 0 }}>
      <Typography variant="h6" gutterBottom>
        Recommended job matches
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Select the roles you want to apply for, then generate tailored resumes.
      </Typography>

      {resumeSkills.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Skills detected from your resume:
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
            {resumeSkills.slice(0, 15).map((skill, i) => (
              <Chip key={i} label={skill} size="small" variant="outlined" color="primary" />
            ))}
            {resumeSkills.length > 15 && (
              <Chip label={`+${resumeSkills.length - 15} more`} size="small" variant="outlined" />
            )}
          </Stack>
        </Box>
      )}

      {jobs.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}>
          <AutoAwesomeIcon sx={{ fontSize: 48, mb: 1, opacity: 0.6 }} />
          <Typography variant="subtitle1">No matches found</Typography>
          <Typography variant="body2">
            Try uploading a different resume or adjusting your filters.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => {
            const isSelected = selected.has(job.id);
            return (
              <Grid item key={job.id} xs={12} sm={6} md={4}>
                <Card
                  variant="outlined"
                  onClick={() => toggle(job.id)}
                  sx={{
                    height: '100%',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    borderWidth: isSelected ? 2 : 1,
                    transition: 'border-color 0.2s, border-width 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <CardContent sx={{ width: '100%' }}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ pr: 1 }}
                      >
                        {job.title}
                      </Typography>
                      <Checkbox
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                        sx={{ p: 0, mt: 0.25 }}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ mt: 1, alignItems: 'center' }}
                    >
                      <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.company}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ mt: 0.5, alignItems: 'center' }}
                    >
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Stack>

                    {job.requiredExperience != null && (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ mt: 0.5, alignItems: 'center' }}
                      >
                        <WorkHistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.requiredExperience}+ yrs exp
                        </Typography>
                      </Stack>
                    )}

                    <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip
                        label={`${job.matchScore}% Match`}
                        color={scoreColor(job.matchScore)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      {job.roleSimilarity > 0 && (
                        <Chip
                          label={`${job.roleSimilarity}% Role Fit`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    {job.matchedSkills && job.matchedSkills.length > 0 && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Matched {job.matchedSkills.length} of {job.totalJobSkills} skills
                        </Typography>
                      </Box>
                    )}

                    {formatDate(job.postedDate) && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Posted {formatDate(job.postedDate)}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetails(job.id);
                        }}
                        sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                      >
                        View Details
                      </Button>
                      {job.applyUrl && (
                        <Tooltip title="View original posting">
                          <Button
                            size="small"
                            endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(getSafeUrl(job.applyUrl), '_blank', 'noopener,noreferrer');
                            }}
                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                          >
                            View Posting
                          </Button>
                        </Tooltip>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ m: 0, p: 2, pr: 6, position: 'relative' }}>
          {loadingDetails ? (
            <Skeleton variant="text" width="60%" />
          ) : selectedJobDetails ? (
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {selectedJobDetails.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                {selectedJobDetails.company || 'Confidential'} — {selectedJobDetails.location || 'Remote'}
              </Typography>
            </Box>
          ) : (
            'Job Details'
          )}
          <IconButton
            aria-label="close"
            onClick={handleCloseDetails}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
              <Skeleton variant="rectangular" height={100} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </Box>
          )}

          {detailsError && (
            <Typography color="error" variant="body1">
              {detailsError}
            </Typography>
          )}

          {selectedJobDetails && (
            <Box sx={{ py: 1 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {selectedJobDetails.posted_date && (
                  <Chip
                    label={`Posted: ${new Date(selectedJobDetails.posted_date).toLocaleDateString()}`}
                    size="small"
                    variant="outlined"
                  />
                )}
                {selectedJobDetails.source && (
                  <Chip
                    label={`Source: ${selectedJobDetails.source}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Description
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  whiteSpace: 'pre-wrap',
                  color: 'text.primary',
                  lineHeight: 1.6,
                }}
              >
                {selectedJobDetails.description || 'No description available.'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDetails} variant="outlined" sx={{ textTransform: 'none' }}>
            Close
          </Button>
          {selectedJobDetails?.apply_url && (
            <Button
              variant="contained"
              endIcon={<OpenInNewIcon />}
              onClick={() => window.open(getSafeUrl(selectedJobDetails.apply_url), '_blank', 'noopener,noreferrer')}
              sx={{ textTransform: 'none' }}
            >
              Apply Now
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Slide direction="up" in={selectedCount > 0} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: (t) => t.zIndex.appBar,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              maxWidth: 1100,
              mx: 'auto',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {selectedCount} {selectedCount === 1 ? 'Job' : 'Jobs'} Selected
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={
                generating ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <AutoAwesomeIcon />
                )
              }
              disabled={generating}
              onClick={handleGenerate}
            >
              {generating ? 'Generating...' : 'Generate Tailored Resumes'}
            </Button>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
}

