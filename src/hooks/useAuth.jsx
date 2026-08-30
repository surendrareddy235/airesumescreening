import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import NotificationContext from "../context/NotificationContext";
import useAPI from "../api/useApi";
import {
  login,
  signup,
  verify,
  logout,
  forgotPasswordApi,
  resetPasswordApi,
} from "../api/auth";
import { useAuthContext } from "../context/AuthContext";
const useAuth = () => {
  const navigate = useNavigate();
  const notification = useContext(NotificationContext);
  const { checkAuth } = useAuthContext();
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { request: resetPasswordRequest } = useAPI(resetPasswordApi);
  const { request: forgotPasswordRequest } = useAPI(forgotPasswordApi);
  const loginForm = useForm();
  const signupForm = useForm();
  const password = signupForm.watch("password");

  // Register signup_purpose as required so form validation catches it
  signupForm.register("signup_purpose", { required: "Please select a purpose" });

  /* ================= LOGIN ================= */
  const loginUser = async (data) => {
    notification.showLoader();
    try {
      const res = await login(data);

      if (res?.data?.token) {
        notification.success("Login successful");
        await checkAuth();
        navigate("/jobs");
      } else {
        notification.error("Login failed");
      }
    } catch (err) {
      notification.error(err.response?.data?.detail || "Login failed");
    } finally {
      notification.hideLoader();
    }
  };

  /* ================= SIGNUP ================= */
  const sendCode = async (data) => {
    setLoading(true);
    notification.showLoader();
    try {
      const res = await signup(data);

      if (res?.data?.ok) {
        setIsCodeSent(true);
        notification.success(`Verification code sent to ${data.email}`);
      }
    } catch (err) {
      notification.error(err.response?.data?.detail || "Failed to send code");
    } finally {
      setLoading(false);
      notification.hideLoader();
    }
  };

  const verifyCode = async (data) => {
    setLoading(true);
    notification.showLoader();
    try {
      const res = await verify(data);

      if (res?.data?.ok) {
        notification.success("Signup successful!");
        await checkAuth();
        setIsCodeSent(false);
        navigate("/jobs");
      }
    } catch (err) {
      notification.error(err.response?.data?.detail || "Verification failed");
    } finally {
      setLoading(false);
      notification.hideLoader();
    }
  };

  const logoutUser = async () => {
    notification.showLoader();
    try {
      await logout(); // backend logout
      await checkAuth();
      notification.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      notification.error(err.response?.data?.detail || "Logout failed");
    } finally {
      notification.hideLoader();
    }
  };
  const forgotPassword = async (data) => {
    notification.showLoader();
    try {
      const res = await forgotPasswordRequest(data);
      if (res?.data?.ok) {
        notification.success("Reset code sent to your email");
        return true;
      }
      return false;
    } catch (err) {
      notification.error(
        err.response?.data?.detail || "Failed to send reset code",
      );
      return false;
    } finally {
      notification.hideLoader();
    }
  };

  const resetPassword = async (data) => {
    const payload = {
      email: data?.email,
      code: data?.code,
      new_password: data?.new_password,
    };
    notification.showLoader();
    try {
      const res = await resetPasswordRequest(payload);
      if (res?.data?.ok) {
        notification.success("Password reset successfully! Please login.");
        navigate("/login");
        return true;
      }
      return false;
    } catch (err) {
      notification.error(err.response?.data?.detail || "Password reset failed");
      return false;
    } finally {
      notification.hideLoader();
    }
  };

  return {
    /* Login */
    loginRegister: loginForm.register,
    loginHandleSubmit: loginForm.handleSubmit,
    loginErrors: loginForm.formState.errors,
    loginUser,
    loginLoading: loading,

    /* Signup */
    signupRegister: signupForm.register,
    signupHandleSubmit: signupForm.handleSubmit,
    signupErrors: signupForm.formState.errors,
    signupSetValue: signupForm.setValue,
    signupWatch: signupForm.watch,
    sendCode,
    verifyCode,

    /* Password Reset */
    forgotPassword,
    resetPassword,

    password,
    logoutUser,
    isCodeSent,
    loading,
  };
};

export default useAuth;
