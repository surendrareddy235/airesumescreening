import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

export default function CandidateModal({ open, onClose, data }) {
  if (!data) return null;
  const avatarColors = [
    "#1D4ED8", // blue
    "#059669", // green
    "#7C3AED", // purple
    "#DC2626", // red
    "#D97706", // amber
    "#0F766E", // teal
    "#9333EA", // violet
    "#2563EB", // indigo
  ];
  const getAvatarColor = (name = "") => {
    const charCode = name.charCodeAt(0);
    return avatarColors[charCode % avatarColors.length];
  };
  const statusStyles = {
    shortlisted: { bg: "#DCFCE7", color: "#166534" },
    rejected: { bg: "#FEE2E2", color: "#991B1B" },
    pending: { bg: "#FEF3C7", color: "#92400E" },
  };
  const normalizeReasoning = (reasoning) => {
    if (!reasoning) return "No screening reason available.";
    if (typeof reasoning === "string") return reasoning.trim();
    if (Array.isArray(reasoning)) return reasoning.filter(Boolean).join(" ").trim();
    if (typeof reasoning === "object") {
      return Object.values(reasoning)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter(Boolean)
        .join(" ")
        .trim();
    }
    return String(reasoning).trim();
  };
  const combined = normalizeReasoning(data.reasoning);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" fontWeight={600}>
            Candidate Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" gap={3} mb={3} alignItems="center">
          <Avatar
            sx={{
              bgcolor: getAvatarColor(data.name),
              fontWeight: 600,
              width: 40,
              height: 40,
            }}
          >
            {data.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box flex={1}>
            <Typography variant="h4">{data.name}</Typography>
            <Chip
              label={data.status}
              sx={{
                mt: 1,
                bgcolor: statusStyles[data.status]?.bg,
                color: statusStyles[data.status]?.color,
              }}
            />
          </Box>

          <Box textAlign="right">
            <Typography variant="body2" fontWeight={600}>
              Match Score
            </Typography>
            <Typography
              variant="body1"
              fontWeight={700}
              lineHeight={2}
              sx={{
                color:
                  data.match_score >= 85
                    ? "#166534" // green
                    : data.match_score >= 50
                      ? "#92400E" // amber
                      : "#991B1B", // red
              }}
            >
              {data.match_score}%
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={2}>
          <Box display="flex" gap={2}>
            <EmailOutlinedIcon />
            <Typography>{data.email}</Typography>
          </Box>

          <Box display="flex" gap={2}>
            <PhoneOutlinedIcon />
            <Typography>{data.phone}</Typography>
          </Box>

          <Box display="flex" gap={2}>
            <WorkOutlineIcon />
            <Typography>{data.experience_years} </Typography>
          </Box>
          <Box mt={2}>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {data.skills
                ?.split(",")
                // .slice(0, 2)
                .map((skill) => (
                  <Chip
                    key={skill}
                    label={skill.trim()}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                    }}
                  />
                ))}
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />

          {/* Screening Reasoning */}
          <Typography variant="h6" fontWeight={600} mb={2}>
            Screening Reason
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={3}
            sx={{ lineHeight: 1.7 }}
          >
            {combined}
          </Typography>
          <Divider sx={{ my: 3 }} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

