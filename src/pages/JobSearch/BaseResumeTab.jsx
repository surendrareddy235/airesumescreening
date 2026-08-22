import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Pagination from '@mui/material/Pagination';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { matchResume, listAllJobs, getJobDetail } from './jobSearchApi';

const ACCEPTED = ['.pdf'];

const LOCATIONS = [
  'Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Chennai',
  'Delhi', 'Gurgaon', 'Noida', 'Kolkata', 'Ahmedabad',
];

const getSafeUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

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

export default function BaseResumeTab({ onNext, onMatchResults, onAddToApplications }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter state for matching
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [roleSimilarity, setRoleSimilarity] = useState(60);

  const SEARCH_LIMIT = 50;

  const [searchRole, setSearchRole] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchExperience, setSearchExperience] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Job details dialog state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const validateAndSet = (selected) => {
    if (!selected) return;
    const lower = selected.name.toLowerCase();
    const valid = ACCEPTED.some((ext) => lower.endsWith(ext));
    if (!valid) {
      setError('Unsupported file type. Please upload a PDF file.');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.');
      return;
    }
    setError(null);
    setFile(selected);
  };

  const handleNext = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        min_score: 0,
        min_role_similarity: roleSimilarity,
      };
      if (location.trim()) params.location = location.trim();
      if (experience && !isNaN(parseFloat(experience))) {
        params.experience = parseFloat(experience);
      }

      const data = await matchResume(file, params);
      const jobs = (data.jobs || []).map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company || 'Confidential',
        location: job.location || 'Remote',
        matchScore: Math.round(job.match_score || 0),
        roleSimilarity: Math.round(job.role_similarity || 0),
        description: job.description || '',
        applyUrl: job.apply_url || '',
        source: job.source || 'External',
        postedDate: job.posted_date,
        matchedSkills: job.matched_skills || [],
        totalJobSkills: job.total_job_skills || 0,
        requiredExperience: job.required_experience,
      }));
      onMatchResults({ jobs, resumeSkills: data.resume_skills || [], file });
      onNext();
    } catch (err) {
      setError(err.message || 'Failed to match resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (p) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const filters = {};
      if (searchRole.trim()) filters.role = searchRole.trim();
      if (searchLocation) filters.location = searchLocation;
      if (searchExperience !== '' && !isNaN(parseFloat(searchExperience))) {
        filters.experience = parseFloat(searchExperience);
      }
      const skip = (p - 1) * SEARCH_LIMIT;
      const { items, total: totalCount } = await listAllJobs(skip, SEARCH_LIMIT, filters);
      setSearchResults(items);
      setTotal(totalCount);
      setPage(p);
    } catch (err) {
      setSearchError(err.message || 'Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchJobs(1);
  };

  const handlePageChange = (_, p) => {
    fetchJobs(p);
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

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Left Column: Upload */}
        <Grid item xs={12} md={file ? 6 : 12}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Upload your base resume
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We&apos;ll analyze your skills and match you with the best jobs from our database.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Paper
            variant="outlined"
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              validateAndSet(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            sx={{
              p: 6,
              textAlign: 'center',
              cursor: 'pointer',
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: dragActive ? 'primary.main' : 'divider',
              bgcolor: dragActive ? 'action.hover' : 'background.paper',
              transition: 'border-color .2s, background-color .2s',
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(',')}
              hidden
              onChange={(e) => validateAndSet(e.target.files?.[0] ?? undefined)}
            />
            <CloudUploadIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Drag &amp; drop your resume here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or click to browse — PDF, up to 10 MB
            </Typography>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Choose File
            </Button>
          </Paper>

          {file && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <DescriptionIcon color="primary" />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(0)} KB
                </Typography>
              </Box>
              <Chip
                icon={<CheckCircleIcon />}
                label="Ready"
                color="success"
                size="small"
                variant="outlined"
              />
            </Paper>
          )}

          <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
              disabled={!file || loading}
              onClick={handleNext}
              fullWidth={!file}
            >
              {loading ? 'Analyzing Resume...' : 'Next: Find Jobs'}
            </Button>
          </Stack>
        </Grid>

        {/* Right Column: Role Similarity (only shows when file is selected) */}
        {file && (
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <TuneIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Search Filters
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (optional)
                </Typography>
              </Stack>

              <Stack spacing={2.5}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={600}>
                      Minimum Role Similarity
                    </Typography>
                    <Chip
                      label={`${roleSimilarity}%`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    How closely job titles should match your experience
                  </Typography>
                  <Slider
                    value={roleSimilarity}
                    onChange={(_, v) => setRoleSimilarity(v)}
                    min={0}
                    max={100}
                    step={5}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => `${v}%`}
                    sx={{ mt: 1 }}
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">Show more jobs</Typography>
                    <Typography variant="caption" color="text.secondary">Strict match</Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Search Jobs Section (replaces Browse Database Jobs) */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Search Jobs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Search available jobs by role, location, and experience.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'flex-end' }}
          sx={{ mb: 3 }}
        >
          <TextField
            size="small"
            label="Role"
            placeholder="e.g. Software Engineer"
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            size="small"
            label="Experience (years)"
            placeholder="e.g. 3"
            type="number"
            value={searchExperience}
            onChange={(e) => setSearchExperience(e.target.value)}
            InputProps={{ inputProps: { min: 0, step: 0.5 } }}
            sx={{ minWidth: 160 }}
          />
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={searchLocation}
              label="Location"
              onChange={(e) => setSearchLocation(e.target.value)}
            >
              <MenuItem value="">All Locations</MenuItem>
              {LOCATIONS.map((loc) => (
                <MenuItem key={loc} value={loc.toLowerCase()}>{loc}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={searchLoading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
            onClick={handleSearch}
            disabled={searchLoading}
            sx={{ textTransform: 'none', height: 40 }}
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </Button>
        </Stack>

        {/* Search Results */}
        {searchError && (
          <Alert severity="error" sx={{ mb: 2 }}>{searchError}</Alert>
        )}

        {searchLoading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item key={i} xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Skeleton variant="text" width="70%" height={28} />
                  <Skeleton variant="text" width="50%" />
                  <Skeleton variant="rounded" height={24} sx={{ mt: 2 }} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : !searchLoading && searchResults.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <SearchIcon sx={{ fontSize: 48, mb: 1, opacity: 0.6 }} />
            <Typography variant="subtitle1">No jobs found</Typography>
            <Typography variant="body2">Try adjusting your search filters.</Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={2}>
              {searchResults.map((job) => (
                <Grid item key={job.id} xs={12} sm={6} md={4}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      transition: 'box-shadow 0.2s',
                      cursor: 'default',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                        <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.company || 'Confidential'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location || 'Remote'}
                        </Typography>
                      </Stack>
                      {job.required_experience != null && (
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 1 }}>
                          <WorkHistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.required_experience}+ yrs exp
                          </Typography>
                        </Stack>
                      )}
                      {formatDate(job.posted_date) && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                          Posted {formatDate(job.posted_date)}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenDetails(job.id)}
                          sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          View Details
                        </Button>
                        {job.apply_url && (
                          <Tooltip title="View original posting">
                            <Button
                              size="small"
                              endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(getSafeUrl(job.apply_url), '_blank', 'noopener,noreferrer');
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
              ))}
            </Grid>
            {total > SEARCH_LIMIT && !searchLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, gap: 2 }}>
                <Pagination
                  count={Math.ceil(total / SEARCH_LIMIT)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80, textAlign: 'center' }}>
                  {page} of {Math.ceil(total / SEARCH_LIMIT)}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

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
    </Box>
  );
}
