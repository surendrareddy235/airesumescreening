import { apiService } from "./api";

class AuthService {
  async login(credentials) {
    return apiService.post("/auth/login", credentials);
  }

  async signup(userData) {
    return apiService.post("/auth/signup", userData);
  }

  async verifyEmail(data) {
    return apiService.post("/auth/verify", data);
  }

  async forgotPassword(email) {
    return apiService.post("/auth/forgot-password", { email });
  }

  async resetPassword(data) {
    return apiService.post("/auth/reset-password", data);
  }

  async getCurrentUser() {
    return apiService.get("/user/me");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  getUser() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
