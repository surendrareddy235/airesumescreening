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
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { keyframes } from "@emotion/react";

/* Animations */
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const LoginPage = () => {
  const {
    loginRegister,
    loginHandleSubmit,
    loginErrors,
    loginLoading,
    loginUser,
    forgotPassword,
  } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href =
      "http://api.empikaai.com/api/auth/login/google";
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
            "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(0,0,0,0) 70%)",
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
      <Backdrop
        open={loginLoading}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
      >
        <CircularProgress sx={{ color: "#818cf8" }} />
      </Backdrop>

      {/* Login Card */}
      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper
          elevation={20}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Box
              sx={{
                width: 38,
                height: 38,
                bgcolor: "#4f46e5",
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <Lock sx={{ color: "#fff", fontSize: 20 }} />
            </Box>

            <Typography variant="h5" fontWeight={700}>
              Welcome Back
            </Typography>
            <Typography fontSize="0.8rem" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          {/* Google Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={loginLoading}
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
            Sign in with Google
          </Button>

          <Divider sx={{ mb: 2 }}>
            <Typography fontSize="0.75rem">OR</Typography>
          </Divider>

          {/* Login Form */}
          <form onSubmit={loginHandleSubmit(loginUser)}>
            <Stack spacing={1.6}>
              <TextField
                size="small"
                label="Email"
                fullWidth
                {...loginRegister("email", { required: true })}
                error={!!loginErrors.email}
                helperText={loginErrors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { fontSize: "0.8rem" } }}
              />

              <TextField
                size="small"
                label="Password"
                type="password"
                fullWidth
                {...loginRegister("password", { required: true })}
                error={!!loginErrors.password}
                helperText={loginErrors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { fontSize: "0.8rem" } }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loginLoading}
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
                Log In
              </Button>
            </Stack>
          </form>

          <Typography
            mt={2}
            textAlign="center"
            fontSize="0.75rem"
            color="text.secondary"
          >
            Don’t have an account?{" "}
            <Link to="/signup" style={{ color: "#4f46e5", fontWeight: 600 }}>
              Sign Up
            </Link>
          </Typography>
          <Typography
            mt={1}
            textAlign="center"
            fontSize="0.75rem"
            color="text.secondary"
          >
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              style={{ color: "#4f46e5", fontWeight: 600 }}
            >
              Reset Password
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
