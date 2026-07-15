import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { KycStatus } from "@/entities/user";

class KycService {
  syncStatus() {
    return apiClient.get<{ status: KycStatus }>(ENDPOINTS.KYC.STATUS);
  }
  sendPhoneOtp(phone: string) {
    return apiClient.post(ENDPOINTS.KYC.SEND_PHONE_OTP, { phone });
  }
  verifyPhoneOtp(payload: { phone: string; otp: string }) {
    return apiClient.post(ENDPOINTS.KYC.VERIFY_PHONE_OTP, payload);
  }
}

export default new KycService();
