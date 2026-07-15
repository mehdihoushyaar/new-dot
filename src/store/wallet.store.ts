import { create } from "zustand";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  setWallet: (address: string, chainId: number) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  address: null,
  isConnected: false,
  chainId: null,
  setWallet: (address, chainId) => set({ address, isConnected: true, chainId }),
  disconnect: () => set({ address: null, isConnected: false, chainId: null }),
}));

interface BlockchainState {
  mintStep: "idle" | "estimating" | "preparing" | "signing" | "submitting" | "done" | "error";
  txHash: string | null;
  setMintStep: (step: BlockchainState["mintStep"]) => void;
  setTxHash: (hash: string) => void;
  reset: () => void;
}

export const useBlockchainStore = create<BlockchainState>()((set) => ({
  mintStep: "idle",
  txHash: null,
  setMintStep: (mintStep) => set({ mintStep }),
  setTxHash: (txHash) => set({ txHash }),
  reset: () => set({ mintStep: "idle", txHash: null }),
}));
