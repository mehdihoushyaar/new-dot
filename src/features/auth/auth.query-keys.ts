export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  badges: () => [...authKeys.all, "badges"] as const,
  kycStatus: () => [...authKeys.all, "kyc-status"] as const,
};
