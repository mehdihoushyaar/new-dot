import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { User } from "@/entities/user";

export interface LoginPayload { username: string; password: string }
export interface LoginResponse { requires_2fa: boolean; user?: User }
export interface OtpPayload { otp: string }
export interface PreRegisterPayload { email: string }
export interface RegisterCompletePayload {
  username: string; password: string; display_name: string; otp: string;
}

class AuthService {
  preRegister(payload: PreRegisterPayload) {
    return apiClient.post(ENDPOINTS.AUTH.PRE_REGISTER, payload);
  }
  checkEligibility(email: string) {
    return apiClient.post(ENDPOINTS.AUTH.ELIGIBILITY, { email });
  }
  sendOtp(email: string) {
    return apiClient.post(ENDPOINTS.AUTH.SEND_OTP, { email });
  }
  verifyOtp(payload: OtpPayload & { email: string }) {
    return apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, payload);
  }
  registerComplete(payload: RegisterCompletePayload) {
    return apiClient.post<User>(ENDPOINTS.AUTH.REGISTER_COMPLETE, payload);
  }
  login(payload: LoginPayload) {
    return apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload);
  }
  verify2Fa(payload: OtpPayload) {
    return apiClient.post<{ user: User }>(ENDPOINTS.AUTH.VERIFY_2FA, payload);
  }
  logout() {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  }
  getProfile() {
    return apiClient.get<User>(ENDPOINTS.AUTH.PROFILE);
  }
  updateProfile(payload: Partial<User>) {
    return apiClient.patch<User>(ENDPOINTS.AUTH.PROFILE, payload);
  }
  changePassword(payload: { old_password: string; new_password: string }) {
    return apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  }
  forgotPassword(email: string) {
    return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }
  resetPassword(payload: { token: string; new_password: string }) {
    return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  }
  enable2Fa() {
    return apiClient.post(ENDPOINTS.AUTH.ENABLE_2FA);
  }
  disable2Fa(payload: OtpPayload) {
    return apiClient.post(ENDPOINTS.AUTH.DISABLE_2FA, payload);
  }
  getBadges() {
    return apiClient.get(ENDPOINTS.AUTH.BADGES);
  }
  deactivate() {
    return apiClient.post(ENDPOINTS.AUTH.DEACTIVATE);
  }
  changeUsernameOtp() {
    return apiClient.post(ENDPOINTS.AUTH.CHANGE_USERNAME_OTP);
  }
  changeUsername(payload: { username: string; otp: string }) {
    return apiClient.patch(ENDPOINTS.AUTH.CHANGE_USERNAME, payload);
  }
}

export default new AuthService();
