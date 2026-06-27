import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  Backdrop,
  CircularProgress,
  Divider,
  Container,
  Paper,
  CssBaseline,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { Person, Email, Lock, LockOpen, VpnKey, WorkOutline, DescriptionOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { keyframes } from "@emotion/react";
import { API_BASE_URL } from "../config";

/* Animation */
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const SignupPage = () => {
  const {
    signupRegister,
    signupHandleSubmit,
    signupErrors,
    signupSetValue,
    signupWatch,
    password,
    isCodeSent,
    loading,
    sendCode,
    verifyCode,
  } = useAuth();

  const selectedPurpose = signupWatch("signup_purpose");

  const handleGoogleLogin = () => {
    if (!selectedPurpose) return;
    window.location.href = `${API_BASE_URL}/api/auth/login/google?purpose=${selectedPurpose}`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <CssBaseline />

      {/* Background orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "40vw",
          height: "40vw",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
          animation: `${floatAnimation} 10s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "45vw",
          height: "45vw",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)",
          animation: `${floatAnimation} 12s ease-in-out infinite reverse`,
        }}
      />

      {/* Loader */}
      <Backdrop open={loading} sx={{ zIndex: 10 }}>
        <CircularProgress sx={{ color: "#818cf8" }} />
      </Backdrop>

      {/* Signup Card */}
      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper
          elevation={20}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={2.5}>
            <Typography variant="h5" fontWeight={700}>
              Create Account
            </Typography>
            <Typography fontSize="0.8rem" color="text.secondary">
              Join us and get started
            </Typography>
          </Box>

          {/* Purpose Selection */}
          <Box sx={{ mb: 2 }}>
            <Typography
              fontSize="0.8rem"
              fontWeight={600}
              color="text.secondary"
              mb={0.5}
            >
              I want to use this for *
            </Typography>
            <RadioGroup
              row
              value={selectedPurpose || ""}
              onChange={(e) => {
                signupSetValue("signup_purpose", e.target.value, {
                  shouldValidate: true,
                });
              }}
              sx={{ gap: 1 }}
            >
              <FormControlLabel
                value="resume_screening"
                disabled={isCodeSent}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "#6366f1",
                      "&.Mui-checked": { color: "#4f46e5" },
                    }}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <DescriptionOutlined sx={{ fontSize: 16, color: "#6366f1" }} />
                    <Typography fontSize="0.8rem">Resume Screening</Typography>
                  </Stack>
                }
                sx={{
                  border: "1px solid",
                  borderColor:
                    selectedPurpose === "resume_screening"
                      ? "#4f46e5"
                      : "divider",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.3,
                  m: 0,
                  flex: 1,
                  bgcolor:
                    selectedPurpose === "resume_screening"
                      ? "rgba(79,70,229,0.06)"
                      : "transparent",
                  transition: "all 0.2s",
                }}
              />
              <FormControlLabel
                value="job_search"
                disabled={isCodeSent}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "#6366f1",
                      "&.Mui-checked": { color: "#4f46e5" },
                    }}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <WorkOutline sx={{ fontSize: 16, color: "#6366f1" }} />
                    <Typography fontSize="0.8rem">Job Search</Typography>
                  </Stack>
                }
                sx={{
                  border: "1px solid",
                  borderColor:
                    selectedPurpose === "job_search" ? "#4f46e5" : "divider",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.3,
                  m: 0,
                  flex: 1,
                  bgcolor:
                    selectedPurpose === "job_search"
                      ? "rgba(79,70,229,0.06)"
                      : "transparent",
                  transition: "all 0.2s",
                }}
              />
            </RadioGroup>
            {signupErrors.signup_purpose && (
              <FormHelperText error sx={{ ml: 0.5 }}>
                {signupErrors.signup_purpose.message}
              </FormHelperText>
            )}
          </Box>

          {/* Google Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={!selectedPurpose}
            startIcon={
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.08-1.79 2.72v2.26h2.91c1.7-1.57 2.68-3.88 2.68-6.62z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.96 10.71c-.18-.54-.28-1.12-.28-1.71s.1-1.17.28-1.71V4.96H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.04l3-2.33z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"
                />
              </svg>
            }
            sx={{
              py: 1,
              mb: 2,
              fontSize: "0.85rem",
              textTransform: "none",
            }}
          >
            Sign up with Google
          </Button>

          <Divider sx={{ mb: 2 }}>
            <Typography fontSize="0.75rem">OR</Typography>
          </Divider>

          <Stack spacing={1.6}>
            {/* Username */}
            <TextField
              size="small"
              label="Username"
              disabled={isCodeSent}
              {...signupRegister("username", { required: "Username required" })}
              error={!!signupErrors.username}
              helperText={signupErrors.username?.message}
              InputLabelProps={{ style: { fontSize: "0.8rem" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Email */}
            <TextField
              size="small"
              label="Email"
              type="email"
              disabled={isCodeSent}
              {...signupRegister("email", { required: "Email required" })}
              error={!!signupErrors.email}
              helperText={signupErrors.email?.message}
              InputLabelProps={{ style: { fontSize: "0.8rem" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              size="small"
              label="Password"
              type="password"
              disabled={isCodeSent}
              {...signupRegister("password", {
                required: "Password required",
              })}
              error={!!signupErrors.password}
              helperText={signupErrors.password?.message}
              InputLabelProps={{ style: { fontSize: "0.8rem" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              size="small"
              label="Confirm Password"
              type="password"
              disabled={isCodeSent}
              {...signupRegister("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={!!signupErrors.confirmPassword}
              helperText={signupErrors.confirmPassword?.message}
              InputLabelProps={{ style: { fontSize: "0.8rem" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* OTP + Send Code */}
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label="OTP"
                disabled={!isCodeSent}
                {...signupRegister("code", {
                  required: isCodeSent && "OTP required",
                })}
                error={!!signupErrors.code}
                helperText={signupErrors.code?.message}
                InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />

              <Button
                variant="contained"
                onClick={signupHandleSubmit(sendCode)}
                sx={{
                  px: 2,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  background: "linear-gradient(to right, #4f46e5, #7c3aed)",
                }}
              >
                {loading ? "..." : "Send"}
              </Button>
            </Stack>

            {/* Submit */}
            <Button
              fullWidth
              onClick={signupHandleSubmit(verifyCode)}
              sx={{
                mt: 1,
                py: 1.1,
                fontSize: "0.9rem",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                background: "linear-gradient(to right, #4f46e5, #7c3aed)",
              }}
              variant="contained"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Stack>

          <Typography
            mt={2}
            textAlign="center"
            fontSize="0.75rem"
            color="text.secondary"
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4f46e5", fontWeight: 600 }}>
              Log In
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;
