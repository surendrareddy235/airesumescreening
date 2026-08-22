import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UnderDevelopmentPage({ title = "Job Search", message = "This feature is under development." }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        bgcolor: "#f8fafc",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            bgcolor: "rgba(255,255,255,0.9)",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "white",
                boxShadow: "0 12px 30px rgba(25,118,210,0.25)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 36 }}>
                construction
              </span>
            </Box>

            <Typography variant="overline" letterSpacing={2} color="primary">
              Under Development
            </Typography>
            <Typography variant="h4" fontWeight={800} color="text.primary">
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth={420}>
              {message}
            </Typography>

            <Button variant="contained" onClick={() => navigate("/")} sx={{ mt: 1 }}>
              Back to Home
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
