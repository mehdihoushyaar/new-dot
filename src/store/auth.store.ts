import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, KycStatus } from "@/entities/user";

interface AuthFlowState {
  isLoggedIn: boolean;
  user: User | null;
  kycStatus: KycStatus;
  twoFaEnabled: boolean;
  setLoggedIn: (user: User) => void;
  setKycStatus: (status: KycStatus) => void;
  setTwoFaEnabled: (enabled: boolean) => void;
  logout: () => void;
}

export const useAuthFlowStore = create<AuthFlowState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      kycStatus: "none",
      twoFaEnabled: false,
      setLoggedIn: (user) =>
        set({ isLoggedIn: true, user, kycStatus: user.kyc_status, twoFaEnabled: user.two_fa_enabled }),
      setKycStatus: (kycStatus) => set({ kycStatus }),
      setTwoFaEnabled: (twoFaEnabled) => set({ twoFaEnabled }),
      logout: () => set({ isLoggedIn: false, user: null, kycStatus: "none", twoFaEnabled: false }),
    }),
    { name: "auth-storage" }
  )
);

// ── UI flow (not persisted) ──────────────────────────────────────────────────

type AuthFlow = "login" | "register" | "forgot-password" | "kyc" | "2fa-setup" | null;

interface AuthUiFlowState {
  currentFlow: AuthFlow;
  currentStep: number;
  startFlow: (flow: AuthFlow) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetFlow: () => void;
}

export const useAuthUiFlow = create<AuthUiFlowState>()((set) => ({
  currentFlow: null,
  currentStep: 0,
  startFlow: (flow) => set({ currentFlow: flow, currentStep: 0 }),
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  resetFlow: () => set({ currentFlow: null, currentStep: 0 }),
}));
