"use client";
import { useAuthFlowStore } from "@/store/auth.store";
import type { KycStatus } from "@/entities/user";

const BLOCKING_STATUSES: KycStatus[] = ["none", "pending", "rejected"];

export function useKycGuard() {
  const kycStatus = useAuthFlowStore((s: ReturnType<typeof useAuthFlowStore.getState>) => s.kycStatus);
  const isBlocked = BLOCKING_STATUSES.includes(kycStatus);
  return { isBlocked, kycStatus };
}

export function useFollowKycGuard() {
  return useKycGuard();
}
