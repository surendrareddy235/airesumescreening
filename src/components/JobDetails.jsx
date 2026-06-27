import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
  Cpu,
  BrainCircuit,
  Building2,
} from "lucide-react";

function JobDetails({ jobDetails }) {
  if (!jobDetails) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">No job details available.</Typography>
      </Box>
    );
  }

  const { title, jd_parsed } = jobDetails;

  const normalizeList = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
      return value
        .split(/[,\n•]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (typeof value === "object") {
      return Object.values(value)
        .flatMap((item) => normalizeList(item))
        .filter(Boolean);
    }
    return [String(value).trim()].filter(Boolean);
  };

  const {
    role,
    sector,
    jd_experience,
    education_level,
    location,
  } = jd_parsed || {};

  const technologies = normalizeList(
    jd_parsed?.all_technologies ??
    jd_parsed?.["all technologies"] ??
      jd_parsed?.technologies ??
      jd_parsed?.technical_skills ??
      jd_parsed?.skills ??
      jd_parsed?.technology_stack,
  );

  const softSkills = normalizeList(
    jd_parsed?.soft_skills ?? jd_parsed?.softSkills,
  );

  const SectionTitle = ({ icon: Icon, title }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <Icon size={20} color="#1976d2" />
      <Typography variant="subtitle1" fontWeight={700} color="primary">
        {title}
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Main Info Card */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', borderLeft: '6px solid #1976d2' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={800} gutterBottom color="text.primary">
                {title || "Job Title Not Specified"}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                {role || "Role Not Specified"}
              </Typography>
              
              <Stack direction="row" spacing={3} sx={{ mt: 3, flexWrap: 'wrap', gap: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Briefcase size={18} color="#666" />
                  <Typography variant="body2" color="text.secondary">
                    {jd_experience > 0 ? `${jd_experience}+ Years Experience` : "Entry Level"}
                  </Typography>
                </Stack>
                {sector && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Building2 size={18} color="#666" />
                    <Typography variant="body2" color="text.secondary">{sector}</Typography>
                  </Stack>
                )}
                <Stack direction="row" spacing={1} alignItems="center">
                  <MapPin size={18} color="#666" />
                  <Typography variant="body2" color="text.secondary">{location || "Remote"}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <GraduationCap size={18} color="#666" />
                  <Typography variant="body2" color="text.secondary">{education_level || "Any Education"}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Technical Skills Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, height: '100%' }}>
            <SectionTitle icon={Cpu} title="Technical Skills & Technologies" />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {technologies && technologies.length > 0 ? (
                technologies.map((tech, index) => (
                  <Chip 
                    key={index} 
                    label={tech} 
                    variant="outlined"
                    sx={{ 
                      borderRadius: '8px', 
                      fontWeight: 500,
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      borderColor: 'rgba(25, 118, 210, 0.2)',
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
                    }} 
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No specific technologies listed.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Soft Skills Section */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 3, height: '100%' }}>
            <SectionTitle icon={BrainCircuit} title="Soft Skills" />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {softSkills && softSkills.length > 0 ? (
                softSkills.map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    sx={{ 
                      borderRadius: '8px', 
                      fontWeight: 500,
                      backgroundColor: 'rgba(76, 175, 80, 0.04)',
                      color: '#2e7d32',
                      border: '1px solid rgba(76, 175, 80, 0.2)',
                      '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' }
                    }} 
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No soft skills listed.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default JobDetails;


