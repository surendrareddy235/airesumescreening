import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Skeleton from '@mui/material/Skeleton';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleIcon from '@mui/icons-material/Circle';
import InboxIcon from '@mui/icons-material/Inbox';

const STATUS_OPTIONS = ['Generated', 'Applied', 'Interviewing'];

function statusColor(status) {
  switch (status) {
    case 'Applied':
      return 'success.main';
    case 'Interviewing':
      return 'primary.main';
    default:
      return 'text.disabled';
  }
}

export default function ApplicationHubTab({ loading, applications, onStatusChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Application hub
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Download your tailored resumes, apply externally, and track your progress.
      </Typography>

      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 2 }}>
              <Skeleton variant="text" width="40%" height={28} />
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="rounded" width="100%" height={40} sx={{ mt: 2 }} />
            </Paper>
          ))}
        </Stack>
      ) : applications.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}
        >
          <InboxIcon sx={{ fontSize: 48, mb: 1, opacity: 0.6 }} />
          <Typography variant="subtitle1">No applications yet</Typography>
          <Typography variant="body2">
            Select jobs in the Job Matches tab and generate tailored resumes to
            see them here.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {applications.map((app) => (
            <Paper key={app.id} variant="outlined" sx={{ p: 2.5 }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', md: 'center' },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {app.title}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 0.5, flexWrap: 'wrap' }}
                  >
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {app.company}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {app.location}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    Generated on {app.generatedOn}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}
                >
                  <Tooltip title="Download PDF">
                    <IconButton color="primary" size="small">
                      <PictureAsPdfIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download DOCX">
                    <IconButton color="primary" size="small">
                      <ArticleIcon />
                    </IconButton>
                  </Tooltip>

                  {app.applyUrl && (
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<OpenInNewIcon />}
                      onClick={() => window.open(app.applyUrl, '_blank', 'noopener,noreferrer')}
                    >
                      Apply External
                    </Button>
                  )}

                  {!app.applyUrl && (
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<OpenInNewIcon />}
                      disabled
                    >
                      Apply External
                    </Button>
                  )}

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id={`status-${app.id}`}>Status</InputLabel>
                    <Select
                      labelId={`status-${app.id}`}
                      label="Status"
                      value={app.status}
                      onChange={(e) => onStatusChange(app.id, e.target.value)}
                      renderValue={(value) => (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'center' }}
                        >
                          <CircleIcon
                            sx={{
                              fontSize: 12,
                              color: statusColor(value),
                            }}
                          />
                          <span>{value}</span>
                        </Stack>
                      )}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ alignItems: 'center' }}
                          >
                            <CircleIcon
                              sx={{ fontSize: 12, color: statusColor(option) }}
                            />
                            <span>{option}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
