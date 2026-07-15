export const walletKeys = {
  all: ["wallet"] as const,
  list: () => [...walletKeys.all, "list"] as const,
  starsBalance: () => [...walletKeys.all, "stars-balance"] as const,
  transactions: () => [...walletKeys.all, "transactions"] as const,
  blockchainHistory: () => [...walletKeys.all, "blockchain-history"] as const,
};
