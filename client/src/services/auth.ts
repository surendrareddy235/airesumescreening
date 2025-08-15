import { apiService } from "./api";
import type { LoginRequest, SignupRequest, VerifyEmailRequest, User } from "@shared/schema";

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginRequest) {
    return apiService.post<AuthResponse>("/auth/login", credentials);
  }

  async signup(userData: SignupRequest) {
    return apiService.post("/auth/signup", userData);
  }

  async verifyEmail(data: VerifyEmailRequest & { username: string; password: string }) {
    return apiService.post<AuthResponse>("/auth/verify", data);
  }

  async forgotPassword(email: string) {
    return apiService.post("/auth/forgot-password", { email });
  }

  async resetPassword(data: { email: string; code: string; newPassword: string }) {
    return apiService.post("/auth/reset-password", data);
  }

  async getCurrentUser() {
    return apiService.get<{ user: User }>("/user/me");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  getUser(): User | null {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
